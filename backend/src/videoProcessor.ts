import { TwelveLabs, Task } from "twelvelabs-js";
import { promises as fsPromises } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

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
      "Starting analysis",
      75,
      "Running AI analysis for manipulation detection..."
    );

    // Analyze video for manipulation techniques
    console.log("\n🔍 Analyzing video for manipulation techniques...");
    try {
      const result = await client.analyze(task.videoId!, promptText);
      console.log(`📊 Analysis completed successfully`);
      console.log(`📋 Raw result length: ${result.data.length} characters`);

      progressCallback?.(
        "Analysis complete",
        90,
        "AI analysis finished, parsing results..."
      );

      // Parse the analysis result
      let analysisData;
      try {
        analysisData = JSON.parse(result.data);
        console.log(`✅ Successfully parsed JSON result`);
        console.log(
          `📊 Found ${analysisData.clips?.length || 0} clips in analysis`
        );
        progressCallback?.(
          "Results parsed",
          95,
          `Found ${analysisData.clips?.length || 0} manipulation instances`
        );
      } catch (parseError) {
        console.warn(
          "⚠️ Could not parse analysis result as JSON, using raw data"
        );
        console.log("📄 Raw result:", result.data.substring(0, 200) + "...");
        analysisData = { raw: result.data };
        progressCallback?.(
          "Results processed",
          95,
          "Analysis complete (raw format)"
        );
      }

      progressCallback?.(
        "Complete",
        100,
        "Video analysis completed successfully!"
      );

      console.log("🎉 TwelveLabs video processing completed successfully!");

      return {
        success: true,
        videoId: task.videoId!,
        indexId: INDEX_ID,
        analysisResult: analysisData,
      };
    } catch (error) {
      console.error(`❌ Error analyzing video:`, error);
      progressCallback?.("Analysis failed", 0, `Analysis error: ${error}`);
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

    progressCallback?.("Error", 0, errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
