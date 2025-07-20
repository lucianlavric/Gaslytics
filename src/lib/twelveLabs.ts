import { TwelveLabs, Task } from "twelvelabs-js";

const TWELVE_LABS_API_KEY = import.meta.env.VITE_TWELVE_LABS_API_KEY;
const INDEX_ID = "687be5bd61fa6d2e4d153f7d"; // Using existing index

if (!TWELVE_LABS_API_KEY) {
  console.error("VITE_TWELVE_LABS_API_KEY is not set in environment variables");
}

if (typeof globalThis.process === "undefined") {
  // Minimal polyfill for TwelveLabs SDK in browser
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.process = { env: {} };
}

export interface ProcessingResult {
  success: boolean;
  videoId?: string;
  indexId?: string;
  analysisResult?: any;
  error?: string;
}

export interface ProgressCallback {
  (stage: string, progress: number): void;
}

// Validate JSON analysis data against the expected schema from prompt.txt
export const validateAnalysisData = (
  analysisData: any
): { isValid: boolean; error?: string; validatedData?: any } => {
  try {
    // Check if analysisData has the expected structure
    if (!analysisData || typeof analysisData !== "object") {
      return { isValid: false, error: "Analysis data must be an object" };
    }

    // If it's raw data (not parsed JSON), return as is
    if (analysisData.raw) {
      return { isValid: true, validatedData: analysisData };
    }

    // Check if clips array exists
    if (!analysisData.clips || !Array.isArray(analysisData.clips)) {
      return {
        isValid: false,
        error: 'Analysis data must contain a "clips" array',
      };
    }

    // Validate each clip in the array
    const validTactics = [
      "Gaslighting",
      "Blame-shifting",
      "Emotional blackmail",
      "Self-presentation as victim",
      "Exaggeration / overstatement",
      "Dominance & control",
    ];

    const validatedClips = analysisData.clips.map(
      (clip: any, index: number) => {
        // Check required fields
        if (
          !clip.startTime ||
          !clip.endTime ||
          !clip.transcript ||
          !clip.tactic ||
          !clip.justification ||
          !clip.confidence ||
          !clip.solution
        ) {
          throw new Error(
            `Clip ${
              index + 1
            } is missing required fields. Required: startTime, endTime, transcript, tactic, justification, confidence, solution`
          );
        }

        // Validate time format (HH:MM:SS.ss or HH:MM:SS)
        const timeRegex = /^\d{2}:\d{2}:\d{2}(\.\d{2})?$/;
        if (!timeRegex.test(clip.startTime) || !timeRegex.test(clip.endTime)) {
          throw new Error(
            `Clip ${
              index + 1
            } has invalid time format. Expected: HH:MM:SS.ss or HH:MM:SS`
          );
        }

        // Validate tactic is one of the allowed values
        if (!validTactics.includes(clip.tactic)) {
          throw new Error(
            `Clip ${index + 1} has invalid tactic. Allowed: ${validTactics.join(
              ", "
            )}`
          );
        }

        // Validate confidence is a number between 0-100
        if (
          typeof clip.confidence !== "number" ||
          clip.confidence < 0 ||
          clip.confidence > 100
        ) {
          throw new Error(
            `Clip ${
              index + 1
            } has invalid confidence. Must be a number between 0-100`
          );
        }

        // Validate all fields are strings (except confidence)
        if (
          typeof clip.transcript !== "string" ||
          typeof clip.justification !== "string" ||
          typeof clip.solution !== "string"
        ) {
          throw new Error(
            `Clip ${
              index + 1
            } has invalid field types. transcript, justification, and solution must be strings`
          );
        }

        return {
          startTime: clip.startTime,
          endTime: clip.endTime,
          transcript: clip.transcript,
          tactic: clip.tactic,
          justification: clip.justification,
          confidence: clip.confidence,
          solution: clip.solution,
        };
      }
    );

    // Return validated data with proper structure
    return {
      isValid: true,
      validatedData: {
        clips: validatedClips,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      error:
        error instanceof Error ? error.message : "Unknown validation error",
    };
  }
};

export async function processVideoWithTwelveLabs(
  videoUrl: string,
  progressCallback?: ProgressCallback
): Promise<ProcessingResult> {
  try {
    console.log("🚀 Starting TwelveLabs video processing...");
    progressCallback?.("Initializing TwelveLabs client", 5);

    if (!TWELVE_LABS_API_KEY) {
      throw new Error("TwelveLabs API key is not configured");
    }

    // Initialize the TwelveLabs client
    const client = new TwelveLabs({ apiKey: TWELVE_LABS_API_KEY });
    console.log("✅ TwelveLabs client initialized");

    progressCallback?.("Uploading video to TwelveLabs", 10);

    // Upload the video using the signed URL
    console.log("\n📹 Uploading video to TwelveLabs...");
    const task = await client.task.create({
      indexId: INDEX_ID,
      url: videoUrl, // Use URL instead of file path
    });
    console.log(`⏳ Upload task created: id=${task.id}`);

    progressCallback?.("Processing video", 30);

    // Monitor the video indexing process
    console.log("\n🔄 Monitoring indexing progress...");
    await task.waitForDone(50, (task: Task) => {
      console.log(`  Status: ${task.status}`);
      // Update progress during indexing
      if (task.status === "indexing") {
        progressCallback?.("Indexing video", 50);
      }
    });

    if (task.status !== "ready") {
      const error = `Indexing failed with status ${task.status}`;
      console.error(`❌ ${error}`);
      return {
        success: false,
        error,
      };
    }

    console.log(`✅ Video uploaded successfully! Video ID: ${task.videoId}`);
    progressCallback?.("Analyzing conversation patterns", 70);

    // Get the analysis prompt - we'll hardcode it for simplicity in frontend
    const analysisPrompt = `You are an expert analyst of interpersonal manipulation in video and audio. Analyze the supplied video and identify every scene that contains any of the six manipulation tactics listed below. For each qualifying scene, return an entry in a JSON array called "clips" with the exact schema shown under "Expected output format".

1. Target manipulation tactics (all equally important)  
   • Gaslighting – denying obvious facts, telling someone their memory or perception is wrong, or reframing reality to make the other person doubt themself  
   • Blame-shifting – redirecting fault or responsibility onto the other party ("You made me do it", "It's your fault I reacted this way")  
   • Emotional blackmail – leveraging fear, guilt, or obligation to coerce ("If you leave me, I'll…", "After all I've done for you…")  
   • Self-presentation as victim – portraying oneself as harmed or powerless to gain sympathy or deflect accountability  
   • Exaggeration / overstatement – inflating events or qualities far beyond the evidence ("You always do this", "Everyone is against me")  
   • Dominance & control – overt or covert attempts to assert power, including commanding tone, threatening posture, interruptions, looming, or coercive statements  

2. Expected output format  
{
  "clips": [
    {
      "startTime": "HH:MM:SS.ss",
      "endTime":   "HH:MM:SS.ss",
      "transcript": "verbatim or best-effort speech-to-text",
      "tactic": "One of: Gaslighting | Blame-shifting | Emotional blackmail | Self-presentation as victim | Exaggeration / overstatement | Dominance & control",
      "justification": "Short explanation citing both verbal and non-verbal evidence.",
      "confidence": 92,
      "solution": "Constructive advice or healthy response strategy to address this manipulation."
    }
  ]
}`;

    progressCallback?.("Running manipulation detection analysis", 85);

    // Analyze video for manipulation techniques
    console.log("\n🔍 Analyzing video for manipulation techniques...");
    try {
      const result = await client.analyze(task.videoId!, analysisPrompt);
      console.log(`📊 Analysis completed successfully`);

      // Parse the analysis result
      let analysisData;
      try {
        analysisData = JSON.parse(result.data);
        console.log(`✅ Successfully parsed JSON result`);
        console.log(
          `📊 Found ${analysisData.clips?.length || 0} clips in analysis`
        );

        // Validate the analysis data before returning
        const validation = validateAnalysisData(analysisData);
        if (!validation.isValid) {
          console.error(
            "❌ Analysis data validation failed:",
            validation.error
          );
          return {
            success: false,
            error: `Analysis data validation failed: ${validation.error}`,
          };
        }

        console.log("✅ Analysis data validation passed");
        analysisData = validation.validatedData;
      } catch (parseError) {
        console.warn(
          "⚠️ Could not parse analysis result as JSON, using raw data"
        );
        analysisData = { raw: result.data };
      }

      progressCallback?.("Analysis complete", 100);

      console.log("🎉 TwelveLabs video processing completed successfully!");

      return {
        success: true,
        videoId: task.videoId!,
        indexId: INDEX_ID,
        analysisResult: analysisData,
      };
    } catch (error) {
      console.error(`❌ Error analyzing video:`, error);
      return {
        success: false,
        error: `Analysis failed: ${error}`,
      };
    }
  } catch (error) {
    console.error("❌ Error during TwelveLabs processing:", error);

    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("401")) {
        errorMessage = "Authentication error - please check API key";
      } else if (error.message.includes("400")) {
        errorMessage = "Bad request - please check request parameters";
      } else if (error.message.includes("429")) {
        errorMessage = "Rate limit exceeded - please try again later";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
