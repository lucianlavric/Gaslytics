import React, { useState } from 'react';
import { AlertTriangle, Info, ExternalLink } from 'lucide-react';
import TechniqueModal from './TechniqueModal';
import VideoPlayer from './VideoPlayer';
import { useConversation } from '../context/ConversationContext';

const ResultsPage = () => {
  const { conversationData } = useConversation();
  const [selectedTechnique, setSelectedTechnique] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);

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

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-green-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 70) return 'High likelihood of manipulation detected. Consider seeking support.';
    if (score >= 40) return 'Some concerning patterns detected. Healthy boundaries may help.';
    return 'Minimal manipulation detected. Focus on improving communication.';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Conversation Analysis</h1>
        <p className="text-slate-600">A gentle, supportive analysis of your conversation patterns</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Summary and Video */}
        <div className="space-y-6">
          {/* AI Summary */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Conversation Summary</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{analysisResults.summary}</p>
            
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-semibold text-slate-800 mb-2">Mediator's Perspective</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{analysisResults.verdict}</p>
            </div>
          </div>

          {/* Gaslight Score */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Manipulation Likelihood</h2>
              <Info className="w-5 h-5 text-slate-400" />
            </div>
            
            <div className="text-center mb-4">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysisResults.gaslightScore)}`}>
                {analysisResults.gaslightScore}%
              </div>
              <p className={`text-sm ${getScoreColor(analysisResults.gaslightScore)}`}>
                {getScoreMessage(analysisResults.gaslightScore)}
              </p>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  analysisResults.gaslightScore >= 70 ? 'bg-red-500' :
                  analysisResults.gaslightScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                }`}
                style={{ width: `${analysisResults.gaslightScore}%` }}
              />
            </div>
          </div>

          {/* Video Player */}
          <VideoPlayer 
            techniques={analysisResults.techniques}
            currentTime={currentTime}
            onTimeUpdate={setCurrentTime}
          />
        </div>

        {/* Right Column - Techniques */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Detected Patterns</h2>
          
          {analysisResults.techniques.map((technique) => (
            <div
              key={technique.id}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${getSeverityColor(technique.severity)}`}
              onClick={() => setSelectedTechnique(technique)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className={`font-semibold ${getSeverityTextColor(technique.severity)}`}>
                  {technique.name}
                </h3>
                <div className="flex items-center space-x-2">
                  {technique.severity === 'severe' && (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-xs bg-white px-2 py-1 rounded-full">
                    {Math.floor(technique.timestamp / 60)}:{String(technique.timestamp % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mb-3">{technique.definition}</p>
              
              <blockquote className={`text-sm italic border-l-4 pl-3 ${
                technique.severity === 'severe' ? 'border-red-400 text-red-800' :
                technique.severity === 'moderate' ? 'border-amber-400 text-amber-800' :
                'border-yellow-400 text-yellow-800'
              }`}>
                "{technique.quote}"
              </blockquote>
              
              <div className="mt-3 flex items-center text-xs text-slate-500">
                <ExternalLink className="w-3 h-3 mr-1" />
                Click to learn more
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technique Modal */}
      {selectedTechnique && (
        <TechniqueModal
          technique={selectedTechnique}
          onClose={() => setSelectedTechnique(null)}
        />
      )}
    </div>
  );
};

export default ResultsPage;