import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface Technique {
  id: number;
  timestamp: number;
  name: string;
  severity: string;
}

interface VideoPlayerProps {
  techniques: Technique[];
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onTechniqueSelect?: (timestamp: number, patternId?: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ techniques, currentTime, onTimeUpdate, onTechniqueSelect }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-500';
      case 'moderate': return 'bg-amber-500';
      case 'mild': return 'bg-yellow-500';
      default: return 'bg-slate-400';
    }
  };

  // Handle video metadata loaded
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, []);

  // Handle time updates from video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        onTimeUpdate(video.currentTime);
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [onTimeUpdate]);

  // Sync external currentTime changes to video
  useEffect(() => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    const video = videoRef.current;
    if (video && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = clickPosition * duration;
      video.currentTime = newTime;
      onTimeUpdate(newTime);
    }
  };

  const jumpToTechnique = (timestamp: number, patternId?: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = timestamp;
      onTimeUpdate(timestamp);
    }
    if (onTechniqueSelect && patternId !== undefined) {
      onTechniqueSelect(timestamp, patternId);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      video.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      if (isMuted) {
        video.volume = volume;
        setIsMuted(false);
      } else {
        video.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (!isFullscreen) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden">
      {/* Video Area */}
      <div className="relative bg-slate-900 aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/tempmedia/Hydrolic Press 5 Minute Countdown.mp4"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Video overlay controls */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        {/* Timeline */}
        <div className="relative mb-4">
          <div 
            className="w-full h-2 bg-slate-200 rounded-full cursor-pointer"
            onClick={handleTimelineClick}
          >
            {/* Progress bar */}
            <motion.div 
              className="h-2 bg-sage-500 rounded-full"
              initial={false}
              animate={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
              style={{ position: 'absolute', left: 0, top: 0 }}
            />
            {/* Technique markers */}
            {techniques.map((technique) => (
              <button
                key={technique.id}
                className={`absolute top-0 w-3 h-3 rounded-full transform -translate-y-0.5 hover:scale-125 transition-transform ${getMarkerColor(technique.severity)}`}
                style={{ left: `${duration > 0 ? (technique.timestamp / duration) * 100 : 0}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToTechnique(technique.timestamp, technique.id);
                }}
                title={`${technique.name} - ${formatTime(technique.timestamp)}`}
              />
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-sage-500 hover:bg-sage-600 text-white rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="text-slate-600 hover:text-slate-800 transition-colors">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <button 
            onClick={toggleFullscreen}
            className="p-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {/* Technique quick access */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Quick jump to patterns:</h4>
          <div className="flex flex-wrap gap-2">
            {techniques.map((technique) => (
              <button
                key={technique.id}
                onClick={() => jumpToTechnique(technique.timestamp, technique.id)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  technique.severity === 'severe' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                  technique.severity === 'moderate' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                  'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                {technique.name} ({formatTime(technique.timestamp)})
              </button>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default VideoPlayer;