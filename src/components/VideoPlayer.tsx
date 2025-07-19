import React, { useState } from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';

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
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ techniques, currentTime, onTimeUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(300); // Mock 5-minute video

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

  const handleTimelineClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    onTimeUpdate(newTime);
  };

  const jumpToTechnique = (timestamp: number) => {
    onTimeUpdate(timestamp);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden">
      {/* Video Area */}
      <div className="relative bg-slate-900 aspect-video">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Play className="w-8 h-8" />
            </div>
            <p className="text-sm opacity-80">Video would play here</p>
            <p className="text-xs opacity-60 mt-1">
              Current time: {formatTime(currentTime)}
            </p>
          </div>
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
            <div 
              className="h-2 bg-sage-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            
            {/* Technique markers */}
            {techniques.map((technique) => (
              <button
                key={technique.id}
                className={`absolute top-0 w-3 h-3 rounded-full transform -translate-y-0.5 hover:scale-125 transition-transform ${getMarkerColor(technique.severity)}`}
                style={{ left: `${(technique.timestamp / duration) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToTechnique(technique.timestamp);
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
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-sage-500 hover:bg-sage-600 text-white rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-slate-600" />
              <div className="w-16 h-1 bg-slate-200 rounded-full">
                <div className="w-3/4 h-1 bg-slate-400 rounded-full" />
              </div>
            </div>
          </div>

          <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors">
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
                onClick={() => jumpToTechnique(technique.timestamp)}
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