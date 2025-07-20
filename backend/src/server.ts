import http from "http";
import {
  processVideoWithTwelveLabs,
  ProcessingResult,
} from "./videoProcessor.js";

const PORT = process.env.PORT || 3001;

// CORS headers for production
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Add CORS headers to all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const url = new URL(req.url!, `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/api/process-video") {
    try {
      // Parse JSON body
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const { videoUrl } = JSON.parse(body);

          if (!videoUrl) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "videoUrl is required" }));
            return;
          }

          console.log(`🎬 Processing video from URL: ${videoUrl}`);

          // Set up Server-Sent Events for progress updates
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            ...corsHeaders,
          });

          // Send initial connection confirmation
          res.write(
            `data: ${JSON.stringify({
              type: "connected",
              message: "Connected to processing server",
            })}\n\n`
          );

          // Progress callback function with enhanced logging
          const progressCallback = (
            stage: string,
            progress: number,
            message?: string
          ) => {
            const logData = {
              type: "progress",
              stage,
              progress,
              message: message || stage,
              timestamp: new Date().toISOString(),
            };

            console.log(
              `📊 Progress: ${progress}% - ${stage}${
                message ? ` (${message})` : ""
              }`
            );
            res.write(`data: ${JSON.stringify(logData)}\n\n`);
          };

          // Send log messages to frontend
          const sendLog = (level: string, message: string) => {
            const logData = {
              type: "log",
              level,
              message,
              timestamp: new Date().toISOString(),
            };
            console.log(`${level.toUpperCase()}: ${message}`);
            res.write(`data: ${JSON.stringify(logData)}\n\n`);
          };

          sendLog("info", "Starting video processing pipeline...");

          // Process the video
          const result: ProcessingResult = await processVideoWithTwelveLabs(
            videoUrl,
            progressCallback
          );

          if (result.success) {
            sendLog(
              "success",
              `Processing completed! Found ${
                result.analysisResult?.clips?.length || 0
              } clips`
            );
          } else {
            sendLog("error", `Processing failed: ${result.error}`);
          }

          // Send final result
          const finalData = JSON.stringify({
            type: "complete",
            result,
            timestamp: new Date().toISOString(),
          });
          res.write(`data: ${finalData}\n\n`);
          res.end();
        } catch (error) {
          console.error("❌ Error processing video:", error);
          const errorData = JSON.stringify({
            type: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          });
          res.write(`data: ${errorData}\n\n`);
          res.end();
        }
      });
    } catch (error) {
      console.error("❌ Error handling request:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error:
            error instanceof Error ? error.message : "Internal server error",
        })
      );
    }
  } else if (req.method === "GET" && url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        timestamp: new Date().toISOString(),
        message: "TwelveLabs processing server is running",
      })
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(
    `🚀 TwelveLabs Processing Server running on http://localhost:${PORT}`
  );
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `🎬 Video processing: POST http://localhost:${PORT}/api/process-video`
  );
  console.log(`📋 Expects JSON body: { "videoUrl": "https://..." }`);
});

export default server;
