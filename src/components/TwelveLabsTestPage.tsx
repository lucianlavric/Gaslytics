import React, { useState } from "react";
import { TwelveLabs } from "twelvelabs-js";
import { Play, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

// Polyfill for Node.js process object in browser environment
if (typeof globalThis.process === "undefined") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.process = {
    env: {},
    browser: true,
    version: "",
    versions: {},
    platform: "browser",
  };
}

const TwelveLabsTestPage = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Get API key from environment like test.ts
  const TWELVE_LABS_API_KEY = import.meta.env.VITE_TWELVE_LABS_API_KEY;

  const addResult = (
    type: "info" | "success" | "error",
    message: string,
    data?: any
  ) => {
    setTestResults((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Simple TwelveLabs search test - based on test.ts
  const runSimpleSearchTest = async () => {
    if (!TWELVE_LABS_API_KEY) {
      addResult(
        "error",
        "TWELVE_LABS_API_KEY is not set in environment variables"
      );
      addResult(
        "error",
        "Please add VITE_TWELVE_LABS_API_KEY to your .env.local file"
      );
      return;
    }

    setIsLoading(true);
    clearResults();

    try {
      addResult("info", "🚀 Starting Simple TwelveLabs Search Test...");

      // Initialize the TwelveLabs client - same as test.ts
      const client = new TwelveLabs({ apiKey: TWELVE_LABS_API_KEY });
      addResult("success", "✅ TwelveLabs client initialized");

      const indexID = "687be5bd61fa6d2e4d153f7d";

      // Simple search query - same as test.ts
      addResult("info", "🔍 Running search query...");
      const searchResults = await client.search.query({
        indexId: indexID,
        queryText: "people talking",
        options: ["visual", "audio"],
      });

      addResult(
        "success",
        `✅ Search completed! Found ${searchResults.data.length} results`
      );

      // Display results like test.ts
      for (const clip of searchResults.data) {
        addResult(
          "info",
          `📄 Result: video_id=${clip.videoId} score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`
        );
      }

      addResult("info", "🔍 RAW SEARCH RESPONSE", {
        data: searchResults.data,
        pageInfo: searchResults.pageInfo,
      });

      addResult(
        "success",
        "🎉 Simple TwelveLabs search test completed successfully!"
      );
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.toString() || "Unknown error occurred";
      addResult("error", `❌ Error during TwelveLabs test: ${errorMessage}`);

      // Check for common error types
      try {
        const messageStr = String(errorMessage);
        if (messageStr.includes("401")) {
          addResult(
            "error",
            "🔑 Authentication error - please check your API key"
          );
        } else if (messageStr.includes("400")) {
          addResult(
            "error",
            "📝 Bad request - please check your request parameters"
          );
        } else if (messageStr.includes("429")) {
          addResult("error", "⏱️ Rate limit exceeded - please try again later");
        }
      } catch (nestedError) {
        addResult(
          "error",
          "Additional error occurred while processing the original error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Upload test using same index as twelveLabs.ts
  const runUploadTest = async () => {
    if (!TWELVE_LABS_API_KEY) {
      addResult(
        "error",
        "TWELVE_LABS_API_KEY is not set in environment variables"
      );
      addResult(
        "error",
        "Please add VITE_TWELVE_LABS_API_KEY to your .env.local file"
      );
      return;
    }

    if (!selectedFile) {
      addResult("error", "Please select a video file first");
      return;
    }

    setIsLoading(true);
    clearResults();

    try {
      addResult("info", "🚀 Starting TwelveLabs Upload Test...");

      // Initialize the TwelveLabs client
      const client = new TwelveLabs({ apiKey: TWELVE_LABS_API_KEY });
      addResult("success", "✅ TwelveLabs client initialized");

      // Use same index ID as twelveLabs.ts
      const indexID = "687bdd28934487793c566f02";

      // Upload the video
      addResult("info", "📹 Uploading video...");
      addResult("info", `📁 Video file: ${selectedFile.name}`);

      let task;
      try {
        task = await client.task.create({
          indexId: indexID,
          file: selectedFile,
        });
      } catch (uploadError: any) {
        const uploadErrorMsg =
          uploadError?.message || uploadError?.toString() || "Upload failed";
        addResult("error", `❌ Upload failed: ${uploadErrorMsg}`);
        addResult(
          "info",
          "This error often occurs due to browser security limitations when uploading files to external APIs"
        );
        return;
      }

      addResult("success", `⏳ Upload task created: id=${task.id}`);
      addResult("info", "🔍 RAW TASK RESPONSE", {
        id: task.id,
        indexId: task.indexId,
        videoId: task.videoId,
        status: task.status,
      });

      // Monitor the video indexing process
      addResult("info", "🔄 Monitoring indexing progress...");
      try {
        await task.waitForDone(50, (task) => {
          addResult("info", `  Status: ${task.status}`);
        });

        if (task.status !== "ready") {
          addResult("error", `❌ Indexing failed with status ${task.status}`);
        } else {
          addResult(
            "success",
            `✅ Video uploaded successfully! Video ID: ${task.videoId}`
          );
        }
      } catch (monitorError: any) {
        const monitorErrorMsg =
          monitorError?.message ||
          monitorError?.toString() ||
          "Monitoring failed";
        addResult("error", `❌ Monitoring failed: ${monitorErrorMsg}`);
        addResult(
          "info",
          "This often happens when the browser can't maintain long-running connections to external APIs"
        );
      }

      addResult("info", "🔍 RAW FINAL TASK RESPONSE", {
        id: task.id,
        indexId: task.indexId,
        videoId: task.videoId,
        status: task.status,
      });

      addResult("success", "🎉 TwelveLabs upload test completed successfully!");
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.toString() || "Unknown error occurred";
      addResult("error", `❌ Error during TwelveLabs test: ${errorMessage}`);

      try {
        const messageStr = String(errorMessage);
        if (messageStr.includes("401")) {
          addResult(
            "error",
            "🔑 Authentication error - please check your API key"
          );
        } else if (messageStr.includes("400")) {
          addResult(
            "error",
            "📝 Bad request - please check your request parameters"
          );
        } else if (messageStr.includes("429")) {
          addResult("error", "⏱️ Rate limit exceeded - please try again later");
        }
      } catch (nestedError) {
        addResult(
          "error",
          "Additional error occurred while processing the original error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      addResult(
        "info",
        `File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(
          2
        )} MB)`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Play className="mr-3 text-blue-600" />
            TwelveLabs Simple Search Test
          </h1>

          <p className="text-gray-600 mb-6">
            Test TwelveLabs API from the browser with search or upload
            functionality.
          </p>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File (for upload test)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={runSimpleSearchTest}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Play className="mr-2" />
              )}
              Run Search Test
            </button>

            <button
              onClick={runUploadTest}
              disabled={isLoading || !selectedFile}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Play className="mr-2" />
              )}
              Run Upload Test
            </button>
          </div>

          {/* Clear Results */}
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>

        {/* Results Display */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Test Results
          </h2>

          {testResults.length === 0 ? (
            <p className="text-gray-500">
              No test results yet. Run the test to see results.
            </p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-md border-l-4 ${
                    result.type === "success"
                      ? "bg-green-50 border-green-400"
                      : result.type === "error"
                      ? "bg-red-50 border-red-400"
                      : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <div className="flex items-start">
                    {result.type === "success" ? (
                      <CheckCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                    ) : result.type === "error" ? (
                      <AlertCircle className="text-red-600 mt-1 mr-3 flex-shrink-0" />
                    ) : (
                      <Loader2 className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          result.type === "success"
                            ? "text-green-800"
                            : result.type === "error"
                            ? "text-red-800"
                            : "text-blue-800"
                        }`}
                      >
                        {result.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                            View Details
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwelveLabsTestPage;
