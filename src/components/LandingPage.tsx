import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Shield, Search, Heart, Play, Pause, Volume2, Users, TrendingUp, Eye } from 'lucide-react';

const LandingPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Floating conversation bubbles animation
    const bubbles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      text: string;
      color: string;
    }> = [];

    const conversationSnippets = [
      { text: "I understand...", color: "#10B981" },
      { text: "Let's talk", color: "#F59E0B" },
      { text: "I hear you", color: "#8B5CF6" },
      { text: "That's valid", color: "#06B6D4" },
      { text: "I see", color: "#EF4444" },
      { text: "Tell me more", color: "#F97316" }
    ];

    // Initialize bubbles
    for (let i = 0; i < 12; i++) {
      bubbles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 40 + 20,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
        text: conversationSnippets[Math.floor(Math.random() * conversationSnippets.length)].text,
        color: conversationSnippets[Math.floor(Math.random() * conversationSnippets.length)].color
      });
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      time += 0.01;

      bubbles.forEach((bubble, index) => {
        // Update position with floating motion
        bubble.y -= bubble.speed;
        bubble.x += Math.sin(time + index) * 0.5;
        
        // Reset bubble when it goes off screen
        if (bubble.y < -bubble.size) {
          bubble.y = canvas.offsetHeight + bubble.size;
          bubble.x = Math.random() * canvas.offsetWidth;
        }

        // Draw bubble
        ctx.save();
        ctx.globalAlpha = bubble.opacity;
        
        // Bubble background
        ctx.fillStyle = bubble.color + '20';
        ctx.beginPath();
        ctx.roundRect(bubble.x - bubble.size/2, bubble.y - bubble.size/2, bubble.size * 2, bubble.size, bubble.size/4);
        ctx.fill();

        // Bubble text
        ctx.fillStyle = bubble.color;
        ctx.font = `${bubble.size/3}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(bubble.text, bubble.x, bubble.y + bubble.size/6);
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #ecfdf5 50%, #fce7f3 100%)' }}
      />

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* 3D Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-rose-400 via-amber-400 to-sage-500 rounded-3xl shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-2 bg-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-br from-rose-500 to-amber-500 bg-clip-text text-transparent">G</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
          </div>

          <h1 className="text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Decode conversations with
            <span className="block text-transparent bg-gradient-to-r from-rose-500 via-amber-500 to-sage-500 bg-clip-text">
              Gasalytics
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform difficult dialogues into clear insights. Our advanced conversation analysis 
            reveals hidden patterns, emotional dynamics, and communication breakdowns—helping you 
            understand what really happened.
          </p>
          
          <Link
            to="/consent"
            className="inline-flex items-center px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 via-amber-500 to-sage-500 hover:from-rose-600 hover:via-amber-600 hover:to-sage-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
          >
            <Upload className="w-6 h-6 mr-3" />
            Start Your Analysis
            <div className="ml-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </Link>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">See Gasalytics in Action</h2>
          
          {/* Mock Video Player */}
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden mb-6">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors cursor-pointer">
                  <Play className="w-10 h-10 ml-1" />
                </div>
                <p className="text-lg font-medium">Interactive Demo</p>
                <p className="text-sm opacity-80">See how we analyze conversation patterns</p>
              </div>
            </div>
            
            {/* Mock Timeline with Markers */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="relative h-2 bg-white/20 rounded-full">
                <div className="h-2 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full w-1/3"></div>
                {/* Technique Markers */}
                <div className="absolute top-0 left-1/4 w-3 h-3 bg-red-400 rounded-full transform -translate-y-0.5 animate-pulse"></div>
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-amber-400 rounded-full transform -translate-y-0.5 animate-pulse"></div>
                <div className="absolute top-0 left-3/4 w-3 h-3 bg-yellow-400 rounded-full transform -translate-y-0.5 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Mock Analysis Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-semibold text-red-700">Gaslighting</span>
              </div>
              <p className="text-sm text-red-600">"You're remembering it wrong..."</p>
            </div>
            
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="font-semibold text-amber-700">Deflection</span>
              </div>
              <p className="text-sm text-amber-600">"Why are you bringing this up now?"</p>
            </div>
            
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold text-yellow-700">Minimizing</span>
              </div>
              <p className="text-sm text-yellow-600">"It's not that big of a deal..."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Privacy First</h3>
            <p className="text-slate-600">Your conversations are analyzed with complete confidentiality and deleted after analysis.</p>
          </div>
          
          <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Deep Analysis</h3>
            <p className="text-slate-600">Advanced pattern recognition identifies subtle manipulation techniques and emotional dynamics.</p>
          </div>
          
          <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Actionable Insights</h3>
            <p className="text-slate-600">Get specific strategies and resources to improve future conversations and relationships.</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 bg-white/40 backdrop-blur-sm border-y border-white/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-sage-600 to-sage-500 bg-clip-text text-transparent">25K+</div>
              <div className="text-slate-600 font-medium">Conversations Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">94%</div>
              <div className="text-slate-600 font-medium">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">15+</div>
              <div className="text-slate-600 font-medium">Manipulation Patterns</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">24/7</div>
              <div className="text-slate-600 font-medium">Available Analysis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Powered by Advanced Technology</h3>
        <div className="flex justify-center items-center space-x-8 text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg"></div>
            <span className="font-medium">TwelveLabs API</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg"></div>
            <span className="font-medium">Neural Language Processing</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg"></div>
            <span className="font-medium">Emotion Recognition</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;