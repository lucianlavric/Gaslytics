// Run with npx tsx src/twelveLabs.ts

import { TwelveLabs, SearchData, Task } from "twelvelabs-js";
import { promises as fsPromises } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TWELVE_LABS_API_KEY = process.env.TWELVE_LABS_API_KEY;

if (!TWELVE_LABS_API_KEY) {
  console.error("TWELVE_LABS_API_KEY is not set in the .env file.");
  console.error("Please create a .env file in the backend directory with:");
  console.error("TWELVE_LABS_API_KEY=your_api_key_here");
  console.error(
    "Get your API key from: https://playground.twelvelabs.io/dashboard/api-key"
  );
  process.exit(1);
}

async function main() {
  try {
    console.log("🚀 Starting TwelveLabs Video Search Test...\n");

    // Initialize the TwelveLabs client - using non-null assertion since we check above
    const client = new TwelveLabs({ apiKey: TWELVE_LABS_API_KEY! });
    console.log("✅ TwelveLabs client initialized");

    // Step 1: Create an index (only needed to be done once)
    // console.log("\n📋 Creating index...");

    // const index = await client.index.create({
    //   name: `Gaslytics-Test-6`,
    //   models: [
    //     {
    //       name: "marengo2.7",
    //       options: ["visual", "audio"],
    //     },
    //   ],
    // });
    // console.log(`✅ Index created: id=${index.id} name=${index.name}`);
    // console.log("\n🔍 RAW INDEX RESPONSE:");
    // console.log(
    //   JSON.stringify(
    //     {
    //       id: index.id,
    //       name: index.name,
    //       models: index.models,
    //       createdAt: index.createdAt,
    //       updatedAt: index.updatedAt,
    //       videoCount: index.videoCount,
    //       totalDuration: index.totalDuration,
    //       expiresAt: index.expiresAt,
    //     },
    //     null,
    //     2
    //   )
    // );

    const indexID = "687bdd28934487793c566f02";

    // Step 2: Upload the video
    console.log("\n📹 Uploading video...");
    const videoPath = path.join(
      __dirname,
      "..",
      "assets",
      "argumentscenemovie.mp4"
    );

    // Check if video file exists
    try {
      await fsPromises.access(videoPath);
      console.log(`📁 Video file found: ${videoPath}`);
    } catch (error) {
      console.error(`❌ Video file not found: ${videoPath}`);
      return;
    }

    const task = await client.task.create({
      indexId: indexID,
      file: videoPath,
    });
    console.log(`⏳ Upload task created: id=${task.id}`);
    console.log("\n🔍 RAW TASK RESPONSE:");
    console.log(
      JSON.stringify(
        {
          id: task.id,
          indexId: task.indexId,
          videoId: task.videoId,
          status: task.status,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          metadata: task.metadata,
          estimatedTime: task.estimatedTime,
          processedFile: task.processedFile,
        },
        null,
        2
      )
    );

    // Monitor the video indexing process
    console.log("\n🔄 Monitoring indexing progress...");
    await task.waitForDone(50, (task: Task) => {
      console.log(`  Status: ${task.status}`);
    });

    if (task.status !== "ready") {
      throw new Error(`❌ Indexing failed with status ${task.status}`);
    }
    console.log(`✅ Video uploaded successfully! Video ID: ${task.videoId}`);
    console.log("\n🔍 RAW FINAL TASK RESPONSE:");
    console.log(
      JSON.stringify(
        {
          id: task.id,
          indexId: task.indexId,
          videoId: task.videoId,
          status: task.status,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          metadata: task.metadata,
          estimatedTime: task.estimatedTime,
          processedFile: task.processedFile,
        },
        null,
        2
      )
    );

    // Step 3: Perform search queries
    console.log("\n🔍 Performing search queries...\n");

    const searchQueries = [
      "People showing the interpersonal manipulation tactic Gaslighting",
      "People showing People showcasing the interpersonal manipulation tactic Blame Shifting",
      "People showing the interpersonal manipulation tactic Emotional Blackmail",
      "People showing the interpersonal manipulation tactic Self-Presentation as a Victim",
      "People showing the interpersonal manipulation tactic Exaggeration and Overstatement",
      "People showing the interpersonal manipulation tactic Dominance and Control",
    ];

    for (const query of searchQueries) {
      console.log(`\n🔍 Searching for: "${query}"`);
      console.log("─".repeat(50));

      const searchResults = await client.search.query({
        indexId: indexID,
        queryText: query,
        options: ["visual", "audio"],
      });

      // Print formatted search results
      console.log(`📊 Search results (showing top 5):`);
      const topResults = searchResults.data.slice(0, 5);

      if (topResults.length === 0) {
        console.log("   No results found");
      } else {
        topResults.forEach((clip, index) => {
          console.log(
            `   ${index + 1}. Score: ${clip.score.toFixed(
              2
            )} | ${clip.start.toFixed(1)}s - ${clip.end.toFixed(
              1
            )}s | Confidence: ${clip.confidence}`
          );
        });
      }

      // Print raw JSON response
      console.log("\n🔍 RAW SEARCH RESPONSE:");
      console.log(
        JSON.stringify(
          {
            data: searchResults.data,
            pageInfo: searchResults.pageInfo,
            pool: searchResults.pool,
            searchOptions: searchResults.searchOptions,
            warning: searchResults.warning,
          },
          null,
          2
        )
      );
      console.log("\n" + "=".repeat(80));
    }

    console.log("\n🎉 TwelveLabs video search test completed successfully!");
    console.log(`\n📝 Summary:`);
    console.log(`   • Index ID: ${indexID}`);
    console.log(`   • Video ID: ${task.videoId}`);
    console.log(`   • Video file: ${path.basename(videoPath)}`);
    console.log(`   • Search queries tested: ${searchQueries.length}`);
  } catch (error) {
    console.error("❌ Error during TwelveLabs test:", error);

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        console.error("\n🔑 Authentication error - please check your API key");
      } else if (error.message.includes("400")) {
        console.error(
          "\n📝 Bad request - please check your request parameters"
        );
      } else if (error.message.includes("429")) {
        console.error("\n⏱️ Rate limit exceeded - please try again later");
      }
    }
  }
}

// Utility function to print search results (from the guide)
function printPage(searchData: SearchData[]) {
  searchData.forEach((clip) => {
    console.log(
      `video_id=${clip.videoId} score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`
    );
  });
}

// Run the main function
main();
