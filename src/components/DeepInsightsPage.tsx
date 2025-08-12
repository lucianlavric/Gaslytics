import React, { useState, useEffect } from "react";
import { AlertTriangle, ChevronLeft, Clock, Play } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { useConversation } from "../context/ConversationContext";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getConversationById, getFileUrl } from "../lib/supabase";

const DeepInsightsPage = () => {
  const { conversationData } = useConversation();
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get conversation ID from URL params
  const conversationId = searchParams.get("id");

  // ----------------------
  // Mock analysis results (used as fallback) – moved above useEffect to avoid TDZ errors
  const analysisResults = {
    summary:
      "This conversation shows signs of emotional manipulation through consistent interruption patterns and dismissive language. The speaker frequently redirected blame and used minimizing language when discussing the other person's concerns. However, there were also moments of genuine dialogue and attempts at resolution.",
    verdict:
      "While this conversation contained some concerning manipulation tactics, it appears both parties were attempting to communicate. The manipulation detected seems more defensive than intentional. Consider focusing on establishing clearer communication boundaries and using 'I' statements to express feelings.",
    gaslightScore: 34,
    overallTone: "Defensive with moments of genuine concern",
    emotionalTrajectory: [
      { time: 0, emotion: "calm" },
      { time: 30, emotion: "tense" },
      { time: 90, emotion: "heated" },
      { time: 150, emotion: "defensive" },
      { time: 210, emotion: "conciliatory" },
    ],
    techniques: [],
  };

  // Load conversation data and video URL
  useEffect(() => {
    const loadConversationData = async () => {
      if (!conversationId) {
        setError("No conversation ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch conversation from Supabase
        const conversation = await getConversationById(conversationId);

        if (!conversation) {
          setError("Conversation not found");
          return;
        }

        // Get signed URL for video file
        if (conversation.file_path) {
          const signedUrl = await getFileUrl(conversation.file_path);
          setVideoUrl(signedUrl);
        }

        // Use clips data if available, otherwise fall back to mock data
        if (conversation.clips && conversation.clips.clips) {
          // Transform TwelveLabs analysis data to match component format
          const transformedTechniques = conversation.clips.clips.map(
            (clip: any, index: number) => ({
              id: index + 1,
              name: clip.tactic,
              severity:
                clip.confidence > 85
                  ? "severe"
                  : clip.confidence > 70
                  ? "moderate"
                  : "mild",
              timestamp: parseTimeToSeconds(clip.startTime),
              quote: clip.transcript,
              definition: `Analysis: ${clip.justification}`,
              explanation: `Solution: ${clip.solution}`,
              examples: `Confidence: ${clip.confidence}%`,
            })
          );

          setAnalysisData({
            ...analysisResults, // Keep mock summary data for now
            techniques: transformedTechniques,
          });
        } else {
          // Use mock data if no analysis available
          setAnalysisData(analysisResults);
        }
      } catch (err) {
        console.error("Error loading conversation:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load conversation"
        );
      } finally {
        setLoading(false);
      }
    };

    loadConversationData();
  }, [conversationId]);

  // Helper function to parse HH:MM:SS.ss to seconds
  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Show loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center">
          <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Loading Analysis...
          </h2>
          <p className="text-slate-600">Preparing your conversation insights</p>
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center">
          <div className="w-8 h-8 text-red-600 mx-auto mb-4">!</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Error Loading Analysis
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/results")}
            className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
          >
            Back to Results
          </button>
        </div>
      </motion.div>
    );
  }

  // Use loaded analysis data or fall back to mock
  const currentAnalysis = analysisData || analysisResults;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "border-red-300 bg-red-50";
      case "moderate":
        return "border-amber-300 bg-amber-50";
      case "mild":
        return "border-yellow-300 bg-yellow-50";
      default:
        return "border-slate-300 bg-slate-50";
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "text-red-700";
      case "moderate":
        return "text-amber-700";
      case "mild":
        return "text-yellow-700";
      default:
        return "text-slate-700";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const handleJumpToTime = (timestamp: number, patternId?: number) => {
    setCurrentTime(timestamp);
    if (patternId !== undefined) setSelectedPattern(patternId);
  };

  const selectedTechnique = currentAnalysis.techniques.find(
    (t) => t.id === selectedPattern
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Deep Insights
        </h1>
        <p className="text-slate-600">
          Interactive analysis with video playback and detailed pattern
          breakdown
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Video Player */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
            <VideoPlayer
              techniques={currentAnalysis.techniques}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
              onTechniqueSelect={handleJumpToTime}
              videoUrl={videoUrl}
            />
          </div>
        </div>

        {/* Right: Pattern Details or Welcome */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selectedPattern === null ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Pattern Analysis
                </h2>
                <p className="text-slate-600 mb-4">
                  Click on any pattern marker in the video timeline or use the
                  quick jump buttons below the video to view detailed analysis.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-slate-700">
                      Severe patterns
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-slate-700">
                      Moderate patterns
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-slate-700">
                      Mild patterns
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`pattern-${selectedPattern}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`border-2 rounded-2xl transition-all duration-200 ${getSeverityColor(
                  selectedTechnique?.severity || ""
                )}`}
              >
                <div className="p-4 flex items-center">
                  <button
                    className="mr-3 p-2 rounded-full hover:bg-slate-100 transition-colors"
                    onClick={() => setSelectedPattern(null)}
                    aria-label="Back"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h3
                    className={`font-semibold text-lg ${getSeverityTextColor(
                      selectedTechnique?.severity || ""
                    )}`}
                  >
                    {selectedTechnique?.name}
                  </h3>
                  {selectedTechnique?.severity === "severe" && (
                    <AlertTriangle className="w-5 h-5 text-red-600 ml-2" />
                  )}
                  <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full">
                    {formatTime(selectedTechnique?.timestamp || 0)}
                  </span>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-sm text-slate-600 mb-3">
                    {selectedTechnique?.definition}
                  </p>
                  <blockquote
                    className={`text-sm italic border-l-4 pl-3 mb-4 ${
                      selectedTechnique?.severity === "severe"
                        ? "border-red-400 text-red-800"
                        : selectedTechnique?.severity === "moderate"
                        ? "border-amber-400 text-amber-800"
                        : "border-yellow-400 text-yellow-800"
                    }`}
                  >
                    "{selectedTechnique?.quote}"
                  </blockquote>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {selectedTechnique?.explanation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {selectedTechnique?.examples}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DeepInsightsPage;
