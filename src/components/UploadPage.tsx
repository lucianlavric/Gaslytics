import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useConversation } from '../context/ConversationContext';

const UploadPage = () => {
  const navigate = useNavigate();
  const { updateVideoFile } = useConversation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, WebM, or MOV)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      alert('File size must be less than 100MB');
      return;
    }

    setSelectedFile(file);
  };

  const simulateUploadAndProcessing = () => {
    setUploadState('uploading');
    setProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadState('processing');
          
          // Simulate processing time
          setTimeout(() => {
            setUploadState('complete');
            updateVideoFile(selectedFile!);
            
            // Navigate to results after a brief delay
            setTimeout(() => {
              navigate('/results');
            }, 1500);
          }, 3000);
          
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const getStateMessage = () => {
    switch (uploadState) {
      case 'uploading':
        return 'Uploading your conversation...';
      case 'processing':
        return 'Analyzing conversation patterns...';
      case 'complete':
        return 'Analysis complete! Redirecting...';
      default:
        return '';
    }
  };

  const getStateIcon = () => {
    switch (uploadState) {
      case 'complete':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'processing':
      case 'uploading':
        return <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  if (uploadState !== 'idle') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center">
          <div className="mb-6">
            {getStateIcon()}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{getStateMessage()}</h2>
          <p className="text-slate-600 mb-6">
            We're carefully analyzing your conversation with empathy and respect.
          </p>
          
          {uploadState === 'uploading' && (
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-sage-500 to-sage-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          {uploadState === 'processing' && (
            <div className="grid grid-cols-1 gap-4 text-sm text-slate-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" />
                <span>Identifying key moments</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                <span>Analyzing speech patterns</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
                <span>Detecting manipulation techniques</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Upload Your Conversation</h1>
        <p className="text-slate-600 mb-8">
          Share your video file and we'll provide gentle, supportive analysis to help you understand what happened.
        </p>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
            dragActive
              ? 'border-sage-400 bg-sage-50'
              : selectedFile
              ? 'border-green-400 bg-green-50'
              : 'border-slate-300 bg-slate-50 hover:border-sage-300 hover:bg-sage-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {selectedFile ? (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-1">File Selected</h3>
                <p className="text-green-700 text-sm flex items-center justify-center space-x-2">
                  <File className="w-4 h-4" />
                  <span>{selectedFile.name}</span>
                </p>
                <p className="text-green-600 text-xs mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 text-slate-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">
                  Drop your video here or click to browse
                </h3>
                <p className="text-slate-500 text-sm">
                  Supports MP4, WebM, and MOV files up to 100MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* File Requirements */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">File Requirements</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Clear audio with minimal background noise works best</li>
                <li>• Video should show faces for facial expression analysis</li>
                <li>• Conversations longer than 2 minutes provide better insights</li>
                <li>• File size must be under 100MB</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {selectedFile && (
          <div className="mt-8">
            <button
              onClick={simulateUploadAndProcessing}
              className="w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;