import { TwelveLabs, Task } from "twelvelabs-js";
import { promises as fsPromises } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { generateInsights } from "./gemini"; // Import the new Gemini service

dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TWELVE_LABS_API_KEY = process.env.TWELVE_LABS_API_KEY;
const INDEX_ID = "687be5bd61fa6d2e4d153f7d"; // Using existing index

if (!TWELVE_LABS_API_KEY) {
  throw new Error("TWELVE_LABS_API_KEY is not set in environment variables");
}

export interface ProcessingResult {
  success: boolean;
  videoId?: string;
  indexId?: string;
  analysisResult?: any;
  error?: string;
}

export interface ProgressCallback {
  (stage: string, progress: number, message?: string): void;
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
    progressCallback?.(
      "Initializing TwelveLabs client",
      5,
      "Setting up API connection..."
    );

    // Initialize the TwelveLabs client
    const client = new TwelveLabs({ apiKey: TWELVE_LABS_API_KEY! });
    console.log("✅ TwelveLabs client initialized");
    progressCallback?.("Client initialized", 10, "TwelveLabs API client ready");

    progressCallback?.(
      "Uploading video to TwelveLabs",
      15,
      "Sending video URL to TwelveLabs for processing..."
    );

    // Upload the video using the signed URL
    console.log("\n📹 Uploading video to TwelveLabs...");
    console.log("📎 Video URL:", videoUrl);

    const task = await client.task.create({
      indexId: INDEX_ID,
      url: videoUrl, // Use URL instead of file path
    });

    console.log(`⏳ Upload task created: id=${task.id}`);
    console.log(`📊 Task details:`, {
      id: task.id,
      indexId: task.indexId,
      videoId: task.videoId,
      status: task.status,
    });

    progressCallback?.(
      "Video uploaded",
      25,
      `Task created with ID: ${task.id}`
    );

    // Monitor the video indexing process
    console.log("\n🔄 Monitoring indexing progress...");
    progressCallback?.(
      "Processing video",
      30,
      "TwelveLabs is indexing the video..."
    );

    let lastStatus = "";
    await task.waitForDone(50, (task: Task) => {
      if (task.status !== lastStatus) {
        console.log(`  📊 Status changed: ${lastStatus} → ${task.status}`);
        lastStatus = task.status;

        if (task.status === "indexing") {
          progressCallback?.(
            "Indexing video",
            50,
            "TwelveLabs is analyzing video content..."
          );
        } else if (task.status === "validating") {
          progressCallback?.("Validating", 40, "Validating uploaded video...");
        } else if (task.status === "pending") {
          progressCallback?.("Queued", 35, "Video queued for processing...");
        }
      }
    });

    if (task.status !== "ready") {
      const error = `Indexing failed with status ${task.status}`;
      console.error(`❌ ${error}`);
      progressCallback?.("Error", 0, `Processing failed: ${task.status}`);
      return {
        success: false,
        error,
      };
    }

    console.log(`✅ Video uploaded successfully! Video ID: ${task.videoId}`);
    progressCallback?.(
      "Video ready",
      65,
      `Video successfully indexed with ID: ${task.videoId}`
    );

    // Read the prompt from the file
    const promptPath = path.join(__dirname, "..", "prompt.txt");
    let promptText: string;

    try {
      promptText = await fsPromises.readFile(promptPath, "utf-8");
      console.log(`📄 Prompt loaded from: ${promptPath}`);
      console.log(`📝 Prompt length: ${promptText.length} characters`);
      progressCallback?.(
        "Prompt loaded",
        70,
        "Analysis prompt loaded successfully"
      );
    } catch (error) {
      console.error(`❌ Error reading prompt file: ${promptPath}`, error);
      return {
        success: false,
        error: `Error reading prompt file: ${error}`,
      };
    }

    progressCallback?.(
      "Analyzing content",
      70,
      "TwelveLabs is running the analysis prompt..."
    );

    // Run the analysis with the prompt
    console.log("\n🔍 Running analysis...");
    const analysis = await client.analyze(task.videoId!, promptText);
    console.log(`✅ Analysis complete!`);

    console.log("\n📄 Analysis data received (raw):", analysis.data);

    // Parse analysis data if it's a string
    let parsedAnalysis: any;
    if (typeof analysis.data === "string") {
      try {
        const cleaned = analysis.data
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        parsedAnalysis = JSON.parse(cleaned);
        console.log("✅ Parsed analysis JSON successfully");
      } catch (parseErr) {
        console.error("❌ Failed to parse analysis JSON:", parseErr);
        return {
          success: false,
          error: "Failed to parse analysis JSON returned by TwelveLabs",
        };
      }
    } else if (typeof analysis.data === "object" && analysis.data !== null) {
      parsedAnalysis = analysis.data;
    } else {
      return {
        success: false,
        error: "Analysis data format not recognized",
      };
    }

    progressCallback?.("Validating results", 95, "Validating analysis data...");

    // Validate the analysis data from TwelveLabs
    const {
      isValid,
      error: validationError,
      validatedData,
    } = validateAnalysisData(parsedAnalysis);

    if (!isValid) {
      console.error("❌ Validation failed:", validationError);
      return { success: false, error: validationError };
    }

    console.log("✅ Analysis data validated successfully.");

    // Generate insights using Gemini
    progressCallback?.(
      "Generating insights",
      98,
      "Using Gemini to generate summary..."
    );
    const geminiInsights = await generateInsights(validatedData.clips);
    console.log("✅ Gemini insights generated:", geminiInsights);

    // Combine the results
    const combinedResult = {
      ...validatedData,
      ...geminiInsights,
    };

    return {
      success: true,
      videoId: task.videoId,
      indexId: INDEX_ID,
      analysisResult: combinedResult,
    };
  } catch (error) {
    console.error("❌ An unexpected error occurred:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown processing error";
    progressCallback?.("Error", 0, errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
