import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useConversation } from '../context/ConversationContext';
import { uploadVideoFile, createConversation, testConnection, getCurrentUser } from '../lib/supabase';
import { motion } from 'framer-motion';

const UploadPage = () => {
  const navigate = useNavigate();
  const { conversationData, updateVideoFile } = useConversation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    console.log('🔄 Drag event:', e.type);
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    console.log('📁 File dropped');
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      console.log('📄 Dropped file:', {
        name: files[0].name,
        size: files[0].size,
        type: files[0].type
      });
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    console.log('🎯 File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
    });

    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      setError('Please upload a valid video file (MP4, WebM, or MOV)');
      return;
    }

    // Check file size (50MB limit for Supabase free tier)
    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSizeInBytes) {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      console.error('❌ File too large:', file.size, 'bytes');
      setError(`File size (${fileSizeInMB}MB) exceeds the 50MB limit. Please compress your video or use a smaller file.`);
      return;
    }

    console.log('✅ File validation passed');
    setSelectedFile(file);
    setError(null); // Clear any previous errors
  };

  const handleUploadAndProcessing = async () => {
    if (!selectedFile) {
      console.error('❌ No file selected');
      return;
    }

    console.log('🚀 Starting upload and processing...');
    console.log('📊 Conversation data from context:', conversationData);

    try {
      setUploadState('uploading');
      setProgress(0);
      setError(null);

      // Check/create user session
      const user = await getCurrentUser();
      console.log('👤 Current user:', user?.id);

      console.log('📤 Uploading file to Supabase Storage...');
      // Upload file to Supabase Storage (now handles user authentication internally)
      const { filePath, fileName } = await uploadVideoFile(selectedFile);
      console.log('✅ File uploaded successfully:', { filePath, fileName });
      setProgress(30);

      console.log('💾 Creating conversation record in database...');
      // Create conversation record in database (now handles user ID internally)
      const conversationPayload = {
        fileName: selectedFile.name,
        filePath: filePath,
        relationshipType: conversationData.relationship || 'unknown',
        emotionalState: conversationData.emotionalTone || 'neutral',
        conversationTags: conversationData.tags || [],
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        conversationContent: conversationData.context,
        conversationType: 'video',
      };
      
      console.log('📋 Conversation payload:', conversationPayload);
      
      const conversation = await createConversation(conversationPayload);
      console.log('✅ Conversation created successfully:', conversation);

      setProgress(60);
      setUploadState('processing');

      // Update context with file and conversation
      updateVideoFile(selectedFile);
      console.log('🔄 Updated conversation context');
      
      // For now, simulate processing
      setTimeout(() => {
        setProgress(100);
        setUploadState('complete');
        
        setTimeout(() => {
          navigate(`/results?id=${conversation.id}`);
        }, 1500);
      }, 3000);

    } catch (err) {
      console.error('💥 Upload error:', err);
      console.error('📊 Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadState('error');
    }
  };

  const getStateMessage = () => {
    const message = (() => {
      switch (uploadState) {
        case 'uploading':
          return 'Uploading your conversation...';
        case 'processing':
          return 'Analyzing conversation patterns...';
        case 'complete':
          return 'Analysis complete! Redirecting...';
        case 'error':
          return 'Error occurred during upload. Please try again.';
        default:
          return '';
      }
    })();
    
    if (message) {
      console.log('📢 State message:', message);
    }
    
    return message;
  };

  const getStateIcon = () => {
    switch (uploadState) {
      case 'complete':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'processing':
      case 'uploading':
        return <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin" />;
      case 'error':
        return <div className="w-8 h-8 text-red-600">!</div>;
      default:
        return null;
    }
  };

  // Log state changes
  React.useEffect(() => {
    console.log('🔄 Upload state changed:', uploadState);
  }, [uploadState]);

  React.useEffect(() => {
    console.log('📈 Progress updated:', progress + '%');
  }, [progress]);

  React.useEffect(() => {
    if (error) {
      console.log('❌ Error state:', error);
    }
  }, [error]);

  if (uploadState !== 'idle') {
    console.log('🎭 Rendering upload state screen:', uploadState);
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
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
      </motion.div>
    );
  }

  console.log('🏠 Rendering main upload page');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
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
            onChange={(e) => {
              console.log('📂 File input changed');
              e.target.files && handleFileSelection(e.target.files[0]);
            }}
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
              onClick={() => {
                console.log('🎬 Start Analysis button clicked');
                handleUploadAndProcessing();
              }}
              className="w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Analysis
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadPage;