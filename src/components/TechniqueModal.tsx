import React from 'react';
import { X, AlertTriangle, Info, Lightbulb } from 'lucide-react';

interface Technique {
  id: number;
  name: string;
  severity: string;
  timestamp: number;
  quote: string;
  definition: string;
  explanation: string;
  examples: string;
}

interface TechniqueModalProps {
  technique: Technique;
  onClose: () => void;
}

const TechniqueModal: React.FC<TechniqueModalProps> = ({ technique, onClose }) => {
  const getSeverityColor = () => {
    switch (technique.severity) {
      case 'severe': return 'border-red-300 bg-red-50';
      case 'moderate': return 'border-amber-300 bg-amber-50';
      case 'mild': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-slate-300 bg-slate-50';
    }
  };

  const getSeverityIcon = () => {
    switch (technique.severity) {
      case 'severe': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'moderate': return <Info className="w-6 h-6 text-amber-600" />;
      case 'mild': return <Info className="w-6 h-6 text-yellow-600" />;
      default: return <Info className="w-6 h-6 text-slate-600" />;
    }
  };

  const getResponseStrategies = () => {
    switch (technique.name.toLowerCase()) {
      case 'gaslighting':
        return [
          "Trust your memory and feelings - write things down if needed",
          "Ask for specific examples when someone claims you're wrong",
          "Set boundaries: 'I remember this differently, let's move forward'",
          "Seek support from trusted friends or a therapist"
        ];
      case 'deflection':
        return [
          "Stay focused on the original issue: 'Let's address my concern first'",
          "Acknowledge but redirect: 'We can discuss that after this'",
          "Use 'I' statements to express how deflection affects you",
          "Set a time to address their concerns separately"
        ];
      case 'minimizing':
        return [
          "Validate your own feelings: 'My feelings are valid regardless'",
          "Ask for acknowledgment: 'I need you to understand this matters to me'",
          "Explain the impact: 'When you say it's not a big deal, I feel unheard'",
          "Set boundaries around dismissive language"
        ];
      case 'emotional blackmail':
        return [
          "Recognize the manipulation: 'This feels like emotional pressure'",
          "Separate love from compliance: 'Caring doesn't mean agreeing always'",
          "Set boundaries: 'I can care about you and still have my own needs'",
          "Take time to think before responding to guilt trips"
        ];
      default:
        return [
          "Stay calm and acknowledge your feelings",
          "Ask for clarification when something feels off",
          "Set clear boundaries about respectful communication",
          "Consider taking a break if the conversation becomes unhealthy"
        ];
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`border-b-2 p-6 ${getSeverityColor()}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getSeverityIcon()}
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{technique.name}</h2>
                <p className="text-sm text-slate-600 capitalize">
                  {technique.severity} severity • {Math.floor(technique.timestamp / 60)}:{String(technique.timestamp % 60).padStart(2, '0')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Definition */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">What is this?</h3>
            <p className="text-slate-700 leading-relaxed">{technique.definition}</p>
          </div>

          {/* Quote from conversation */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">What was said</h3>
            <blockquote className={`p-4 rounded-2xl border-l-4 italic ${
              technique.severity === 'severe' ? 'bg-red-50 border-red-400 text-red-800' :
              technique.severity === 'moderate' ? 'bg-amber-50 border-amber-400 text-amber-800' :
              'bg-yellow-50 border-yellow-400 text-yellow-800'
            }`}>
              "{technique.quote}"
            </blockquote>
          </div>

          {/* Explanation */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Why this matters</h3>
            <p className="text-slate-700 leading-relaxed">{technique.explanation}</p>
          </div>

          {/* Response Strategies */}
          <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-5 h-5 text-sage-600" />
              <h3 className="text-lg font-semibold text-sage-800">How to respond</h3>
            </div>
            <ul className="space-y-2">
              {getResponseStrategies().map((strategy, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-sage-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sage-700 text-sm">{strategy}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Context */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Remember</h4>
            <p className="text-blue-700 text-sm">
              Recognizing these patterns is the first step toward healthier communication. 
              This analysis is meant to support your understanding, not to judge anyone involved. 
              Consider professional support if these patterns are frequent or causing distress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechniqueModal;