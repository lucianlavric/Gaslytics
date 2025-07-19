import React, { useState } from 'react';
import { AlertTriangle, ChevronLeft, Clock, Play } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { useConversation } from '../context/ConversationContext';
import { motion, AnimatePresence } from 'framer-motion';

const DeepInsightsPage = () => {
  const { conversationData } = useConversation();
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);

  // Mock analysis results
  const analysisResults = {
    summary: "This conversation shows signs of emotional manipulation through consistent interruption patterns and dismissive language. The speaker frequently redirected blame and used minimizing language when discussing the other person's concerns. However, there were also moments of genuine dialogue and attempts at resolution.",
    verdict: "While this conversation contained some concerning manipulation tactics, it appears both parties were attempting to communicate. The manipulation detected seems more defensive than intentional. Consider focusing on establishing clearer communication boundaries and using 'I' statements to express feelings.",
    gaslightScore: 34,
    overallTone: "Defensive with moments of genuine concern",
    emotionalTrajectory: [
      { time: 0, emotion: 'calm' },
      { time: 30, emotion: 'tense' },
      { time: 90, emotion: 'heated' },
      { time: 150, emotion: 'defensive' },
      { time: 210, emotion: 'conciliatory' }
    ],
    techniques: [
      {
        id: 1,
        name: "Deflection",
        severity: "moderate",
        timestamp: 45,
        quote: "Why are you making this about me? You're the one who started this argument.",
        definition: "Redirecting blame or attention away from one's own actions or responsibility.",
        explanation: "The speaker avoided taking responsibility by immediately shifting focus to the other person's behavior.",
        examples: "Instead of addressing the concern raised, the focus was shifted to who 'started' the conflict."
      },
      {
        id: 2,
        name: "Minimizing",
        severity: "mild",
        timestamp: 78,
        quote: "You're overreacting. It's not that big of a deal.",
        definition: "Dismissing or downplaying someone's feelings or experiences.",
        explanation: "The speaker invalidated the other person's emotional response rather than acknowledging their feelings.",
        examples: "Using phrases like 'overreacting' or 'not a big deal' dismisses the other person's valid emotions."
      },
      {
        id: 3,
        name: "Gaslighting",
        severity: "severe",
        timestamp: 134,
        quote: "I never said that. You're remembering it wrong again.",
        definition: "Making someone question their own memory, perception, or judgment.",
        explanation: "This statement directly challenges the other person's memory and suggests a pattern ('again') of them being wrong.",
        examples: "Consistently denying previous statements or suggesting the other person has poor memory."
      },
      {
        id: 4,
        name: "Emotional Blackmail",
        severity: "moderate",
        timestamp: 189,
        quote: "If you really cared about me, you wouldn't bring this up.",
        definition: "Using guilt or emotional pressure to control someone's behavior.",
        explanation: "The speaker questioned the other person's care and love as a way to avoid addressing the issue.",
        examples: "Making someone feel guilty for having legitimate concerns or needs."
      }
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'border-red-300 bg-red-50';
      case 'moderate': return 'border-amber-300 bg-amber-50';
      case 'mild': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-slate-300 bg-slate-50';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-red-700';
      case 'moderate': return 'text-amber-700';
      case 'mild': return 'text-yellow-700';
      default: return 'text-slate-700';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const handleJumpToTime = (timestamp: number, patternId?: number) => {
    setCurrentTime(timestamp);
    if (patternId !== undefined) setSelectedPattern(patternId);
  };

  const selectedTechnique = analysisResults.techniques.find(t => t.id === selectedPattern);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Deep Insights</h1>
        <p className="text-slate-600">Interactive analysis with video playback and detailed pattern breakdown</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Video Player */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
            <VideoPlayer 
              techniques={analysisResults.techniques}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
              onTechniqueSelect={handleJumpToTime}
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
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-4">Pattern Analysis</h2>
                <p className="text-slate-600 mb-4">
                  Click on any pattern marker in the video timeline or use the quick jump buttons below the video to view detailed analysis.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-slate-700">Severe patterns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-slate-700">Moderate patterns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-slate-700">Mild patterns</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`pattern-${selectedPattern}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`border-2 rounded-2xl transition-all duration-200 ${getSeverityColor(selectedTechnique?.severity || '')}`}
              >
                <div className="p-4 flex items-center">
                  <button
                    className="mr-3 p-2 rounded-full hover:bg-slate-100 transition-colors"
                    onClick={() => setSelectedPattern(null)}
                    aria-label="Back"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h3 className={`font-semibold text-lg ${getSeverityTextColor(selectedTechnique?.severity || '')}`}>
                    {selectedTechnique?.name}
                  </h3>
                  {selectedTechnique?.severity === 'severe' && (
                    <AlertTriangle className="w-5 h-5 text-red-600 ml-2" />
                  )}
                  <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full">
                    {formatTime(selectedTechnique?.timestamp || 0)}
                  </span>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-sm text-slate-600 mb-3">{selectedTechnique?.definition}</p>
                  <blockquote className={`text-sm italic border-l-4 pl-3 mb-4 ${
                    selectedTechnique?.severity === 'severe' ? 'border-red-400 text-red-800' :
                    selectedTechnique?.severity === 'moderate' ? 'border-amber-400 text-amber-800' :
                    'border-yellow-400 text-yellow-800'
                  }`}>
                    "{selectedTechnique?.quote}"
                  </blockquote>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Analysis</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedTechnique?.explanation}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Examples</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedTechnique?.examples}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600">Confidence:</span>
                        <span className="font-semibold text-slate-800">85%</span>
                      </div>
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