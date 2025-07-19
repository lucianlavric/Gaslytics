import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { useConversation } from '../context/ConversationContext';

const ConsentPage = () => {
  const navigate = useNavigate();
  const { updateContext } = useConversation();
  const [formData, setFormData] = useState({
    consent: false,
    relationship: '',
    context: '',
    tags: [],
    emotionalTone: ''
  });

  const relationshipTypes = [
    'Family member', 'Romantic partner', 'Friend', 'Colleague', 
    'Manager/Boss', 'Acquaintance', 'Other'
  ];

  const conversationTags = [
    'Tense', 'Awkward', 'Heated', 'Confusing', 'Manipulative', 
    'Gaslighting', 'Dismissive', 'Supportive discussion'
  ];

  const emotionalTones = [
    'Calm', 'Frustrated', 'Anxious', 'Angry', 'Confused', 'Hurt'
  ];

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;
    
    updateContext(formData);
    navigate('/upload');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Consent & Context</h1>
        <p className="text-slate-600 mb-8">
          Help us provide the most supportive analysis by sharing some context about your conversation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Consent Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 mb-2">Important: Consent Required</h3>
                <p className="text-amber-700 text-sm mb-4">
                  All parties in the conversation must have consented to this analysis. This ensures 
                  ethical use and protects everyone's privacy.
                </p>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                    className="w-5 h-5 text-sage-600 border-amber-300 rounded focus:ring-sage-500"
                  />
                  <span className="text-amber-800 font-medium">
                    I confirm all parties have consented to this analysis
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Relationship Context */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              What's your relationship to the other person(s)?
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white"
            >
              <option value="">Select relationship type...</option>
              {relationshipTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Additional context about the conversation (optional)
            </label>
            <textarea
              value={formData.context}
              onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
              placeholder="Share any background that might help us understand the dynamics..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Conversation Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              How would you describe this conversation? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {conversationTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-sage-100 text-sage-700 border-2 border-sage-300'
                      : 'bg-slate-50 text-slate-600 border-2 border-slate-200 hover:border-sage-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Emotional Tone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              How did you feel during this conversation?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {emotionalTones.map(tone => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, emotionalTone: tone }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.emotionalTone === tone
                      ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                      : 'bg-slate-50 text-slate-600 border-2 border-slate-200 hover:border-rose-200'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!formData.consent}
              className={`w-full flex items-center justify-center px-6 py-4 text-lg font-semibold rounded-2xl transition-all duration-200 ${
                formData.consent
                  ? 'bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue to Upload
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsentPage;