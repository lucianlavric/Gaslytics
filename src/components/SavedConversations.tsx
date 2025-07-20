import React, { useState } from 'react';
import { Calendar, Download, Trash2, Eye, Archive } from 'lucide-react';
import { motion } from 'framer-motion';

const SavedConversations = () => {
  const [conversations] = useState([
    {
      id: 1,
      date: '2024-01-15',
      title: 'Work Meeting Discussion',
      gaslightScore: 34,
      verdict: 'Some defensive patterns detected',
      duration: '5:23',
      relationship: 'Colleague',
      tags: ['Tense', 'Work-related']
    },
    {
      id: 2,
      date: '2024-01-10',
      title: 'Family Conversation',
      gaslightScore: 67,
      verdict: 'Concerning manipulation patterns',
      duration: '8:45',
      relationship: 'Family member',
      tags: ['Heated', 'Manipulative']
    },
    {
      id: 3,
      date: '2024-01-05',
      title: 'Relationship Discussion',
      gaslightScore: 12,
      verdict: 'Healthy communication patterns',
      duration: '12:30',
      relationship: 'Romantic partner',
      tags: ['Supportive discussion']
    }
  ]);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-700';
    if (score >= 40) return 'bg-amber-100 text-amber-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Saved Conversations</h1>
        <p className="text-slate-600">Review your previous conversation analyses and track patterns over time.</p>
      </div>

      <div className="space-y-4">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-slate-800">{conversation.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(conversation.gaslightScore)}`}>
                    {conversation.gaslightScore}% manipulation likelihood
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(conversation.date).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <span>{conversation.duration}</span>
                  <span>•</span>
                  <span>{conversation.relationship}</span>
                </div>

                <p className="text-slate-700 mb-3">{conversation.verdict}</p>

                <div className="flex flex-wrap gap-2">
                  {conversation.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tag.includes('Manipulative') || tag.includes('Heated') 
                          ? 'bg-red-100 text-red-700'
                          : tag.includes('Tense') 
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-sage-100 text-sage-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-sage-700 bg-sage-100 hover:bg-sage-200 rounded-full transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition-colors">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Score visualization */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Manipulation likelihood</span>
                <span className={`font-semibold ${conversation.gaslightScore >= 70 ? 'text-red-600' : conversation.gaslightScore >= 40 ? 'text-amber-600' : 'text-green-600'}`}>
                  {conversation.gaslightScore}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    conversation.gaslightScore >= 70 ? 'bg-red-500' :
                    conversation.gaslightScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${conversation.gaslightScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {conversations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No saved conversations yet</h3>
          <p className="text-slate-600 mb-6">Upload your first conversation to start building your analysis history.</p>
          <button className="px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-full font-medium transition-colors">
            Upload a Conversation
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SavedConversations;