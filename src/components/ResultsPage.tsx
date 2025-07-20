import React, { useState, useEffect } from "react";
import { Info, ArrowRight, Loader } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConversation } from "../context/ConversationContext";
import { getConversationById } from "../lib/supabase";
import { Conversation } from "../types/analysis";
import { motion } from "framer-motion";

const ResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const conversationId = searchParams.get("id");

  useEffect(() => {
    if (!conversationId) {
      setError("No conversation ID provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchConversation = async () => {
      try {
        const data = await getConversationById(conversationId);
        if (data) {
          setConversation(data);
        } else {
          setError(
            "Conversation not found or you do not have permission to view it."
          );
        }
      } catch (err) {
        setError("Failed to fetch conversation data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-amber-600";
    return "text-green-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 70)
      return "High likelihood of manipulation detected. Consider seeking support.";
    if (score >= 40)
      return "Some concerning patterns detected. Healthy boundaries may help.";
    return "Minimal manipulation detected. Focus on improving communication.";
  };

  const handleSeeDeeperInsights = () => {
    if (!conversationId) {
      console.warn("No conversation ID found when navigating to Deep Insights");
      navigate("/deep-insights");
      return;
    }
    navigate(`/deep-insights?id=${conversationId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-600">
        <p>Analysis data is not yet available for this conversation.</p>
      </div>
    );
  }

  // Build a unified analysis object regardless of where the data lives in the conversation row
  const analysis = (() => {
    if (conversation.analysis) return conversation.analysis as any;
    return {
      clips: ((conversation as any).clips?.clips ??
        (conversation as any).clips ??
        []) as any[],
      summary: (conversation as any).summary,
      mediatorPerspective: (conversation as any).mediator_perspective,
    } as any;
  })();

  // If absolutely no analysis data is present, show a friendly message
  if (
    (!analysis.clips || analysis.clips.length === 0) &&
    !analysis.summary &&
    !analysis.mediatorPerspective
  ) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-600">
        <p>Analysis data is not yet available for this conversation.</p>
      </div>
    );
  }

  // Calculate manipulation likelihood as average of confidence values
  const calculateManipulationLikelihood = (): number => {
    if (!analysis.clips || analysis.clips.length === 0) {
      return 0;
    }

    const totalConfidence = analysis.clips.reduce(
      (sum, clip) => sum + clip.confidence,
      0
    );
    return Math.round(totalConfidence / analysis.clips.length);
  };

  const manipulationLikelihood = calculateManipulationLikelihood();

  // Use calculated manipulation likelihood
  const analysisResults = {
    gaslightScore: manipulationLikelihood,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Conversation Analysis
        </h1>
        <p className="text-slate-600">
          A gentle, supportive analysis of your conversation patterns
        </p>
      </div>

      <div className="space-y-6">
        {/* AI Summary */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Conversation Summary
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            {analysis.summary || "No summary available."}
          </p>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-800 mb-2">
              Mediator's Perspective
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {analysis.mediatorPerspective || "No perspective available."}
            </p>
          </div>
        </div>

        {/* Gaslight Score */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Manipulation Likelihood
            </h2>
            <Info className="w-5 h-5 text-slate-400" />
          </div>

          <div className="text-center mb-4">
            <div
              className={`text-4xl font-bold mb-2 ${getScoreColor(
                analysisResults.gaslightScore
              )}`}
            >
              {analysisResults.gaslightScore}%
            </div>
            <p
              className={`text-sm ${getScoreColor(
                analysisResults.gaslightScore
              )}`}
            >
              {getScoreMessage(analysisResults.gaslightScore)}
            </p>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                analysisResults.gaslightScore >= 70
                  ? "bg-red-500"
                  : analysisResults.gaslightScore >= 40
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${analysisResults.gaslightScore}%` }}
            />
          </div>
        </div>

        {/* See Deeper Insights Button */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Want to explore deeper?
            </h2>
            <p className="text-slate-600 mb-6">
              Dive into detailed patterns, timestamps, and specific moments in
              your conversation with interactive video analysis.
            </p>
            <button
              onClick={handleSeeDeeperInsights}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              See Deeper Insights
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsPage;
