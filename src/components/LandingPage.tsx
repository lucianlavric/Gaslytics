import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Shield, Search, Heart, Play, Users, TrendingUp, Eye, Lock, Zap, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Emission particles animation
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      color: string;
      wobble: number;
      wobbleSpeed: number;
    }> = [];

    const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    // Initialize emission particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 6 + 2,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01
      });
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      time += 0.005;

      particles.forEach((particle, index) => {
        // Update wobble
        particle.wobble += particle.wobbleSpeed;
        
        // Update position with flowing motion and wobble
        particle.y -= particle.speed;
        particle.x += Math.sin(time + index * 0.1) * 0.3 + Math.sin(particle.wobble) * 0.5;
        
        // Reset particle when it goes off screen
        if (particle.y < -particle.size) {
          particle.y = canvas.offsetHeight + particle.size;
          particle.x = Math.random() * canvas.offsetWidth;
        }

        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          particle.x + Math.sin(particle.wobble) * 1, 
          particle.y + Math.cos(particle.wobble) * 1, 
          0,
          particle.x, 
          particle.y, 
          particle.size * 2
        );
        
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          particle.x + Math.sin(particle.wobble) * 1, 
          particle.y + Math.cos(particle.wobble) * 1, 
          particle.size * 1.5, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
        
        // Add highlight to particle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(
          particle.x + Math.sin(particle.wobble) * 1 - particle.size * 0.3, 
          particle.y + Math.cos(particle.wobble) * 1 - particle.size * 0.3, 
          particle.size * 0.4, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
        
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

  const faqData = [
    {
      question: "Is my data secure and private?",
      answer: "Yes, absolutely. We use enterprise-grade encryption and your conversations are automatically deleted after analysis. We never store or share your personal data with third parties."
    },
    {
      question: "How accurate is the analysis?",
      answer: "Our analysis achieves 94% accuracy through advanced neural language processing and emotion recognition technology. We continuously improve our algorithms based on real-world data."
    },
    {
      question: "What types of conversations can I analyze?",
      answer: "You can analyze any recorded conversation - from personal relationships to workplace interactions. Our system identifies patterns regardless of the context or participants."
    },
    {
      question: "How long does the analysis take?",
      answer: "Most analyses are completed within 2-3 minutes. The processing time depends on the length of your conversation, but we'll show you real-time progress updates."
    },
    {
      question: "Can I save my analysis results?",
      answer: "Yes, you can save your analysis for future reference. All saved data is encrypted and stored securely on your device or in your private account."
    }
  ];

  // Emoticon carousel data
  const emoticons = [
    { emoji: "🔥", label: "Gaslighting Detection", color: "from-red-500 to-orange-500" },
    { emoji: "😤", label: "Emotional Manipulation", color: "from-yellow-500 to-orange-500" },
    { emoji: "😊", label: "Healthy Communication", color: "from-green-500 to-blue-500" }
  ];

  const [currentEmoticon, setCurrentEmoticon] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoticon((prev) => (prev + 1) % emoticons.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      {/* Emission Particles Canvas - Fixed Position */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 opacity-50"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-red-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse delay-3000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full z-20">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-4 flex justify-center">
              <img 
                src="logo.png" 
                alt="Gaslytics Logo" 
                className="w-40 h-40 lg:w-48 lg:h-48 object-contain"
                style={{
                  animation: 'gentleBounce 6s ease-in-out infinite'
                }}
              />
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              <span className="block transform hover:-translate-y-2 transition-transform duration-300 cursor-default">
                Understand What Really
              </span>
              <span className="block text-transparent bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text transform hover:-translate-y-2 transition-transform duration-300 cursor-default hover:scale-105">
                Happened
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Gaslytics uses advanced AI to analyze conversations and reveal hidden patterns, 
              manipulation techniques, and communication dynamics. Get clarity on difficult 
              interactions with unbiased, professional analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/consent"
                className="group inline-flex items-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <Upload className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Start Your Analysis
              </Link>
              <button className="group inline-flex items-center px-10 py-5 text-xl font-semibold text-slate-700 bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-300 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>GDPR compliant</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>94% accuracy rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-50/50 via-yellow-50/30 to-red-50/50 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-8">
              {/* Left Side - Title, Description, and Carousel in one panel */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 flex flex-col justify-between min-h-[600px]">
                <div>
                  <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                    <span className="block text-transparent bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text transform hover:scale-105 transition-transform duration-300 cursor-default mb-2">
                      See Gaslytics
                    </span>
                    <span className="block text-slate-800 transform hover:-translate-y-1 transition-transform duration-300">
                      in Action
                    </span>
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Watch how our advanced AI analysis reveals hidden patterns, manipulation techniques, and communication dynamics that might otherwise go unnoticed.
                  </p>
                </div>
                
                {/* Emoticon Carousel */}
                <div className="flex justify-center mt-8">
                  <div className="relative w-56 h-56">
                    {emoticons.map((emoticon, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                          index === currentEmoticon
                            ? 'opacity-100 scale-100 transform translate-y-0'
                            : 'opacity-0 scale-75 transform translate-y-4'
                        }`}
                      >
                        <div className={`w-40 h-40 bg-gradient-to-br ${emoticon.color} rounded-full flex items-center justify-center shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300`}>
                          <span className="text-7xl">{emoticon.emoji}</span>
                        </div>
                        <p className="text-base font-semibold text-slate-700 text-center">{emoticon.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Side - Large Video Player */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 flex items-center justify-center min-h-[600px]">
                <div className="w-full aspect-[4/3] flex items-center justify-center">
                  <div className="text-center text-slate-800">
                    <div className="w-32 h-32 bg-slate-800/20 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-slate-800/30 transition-colors cursor-pointer transform hover:scale-110">
                      <Play className="w-16 h-16 ml-2 text-slate-800" />
                    </div>
                    <p className="text-2xl font-semibold mb-3">Professional Demo</p>
                    <p className="text-base opacity-80">2:34 • See the complete analysis process</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status indicator under both boxes */}
            <div className="flex justify-center">
              <div className="flex items-center text-base text-slate-600 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-white/20">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span>Real-time analysis • 94% accuracy • Instant insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* People Talking Image Section */}
      <section className="py-8 relative z-20 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <img 
              src="https://via.placeholder.com/600x300/10B981/FFFFFF?text=People+Talking" 
              alt="" 
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: '300px' }}
            />
          </div>
        </div>
      </section>

      {/* Marketing Claims Section */}
      <section className="py-12 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="block text-transparent bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text transform hover:scale-105 transition-transform duration-300 cursor-default mb-2">
                Why Choose
              </span>
              <span className="block text-slate-800 transform hover:-translate-y-1 transition-transform duration-300">
                Gaslytics?
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Professional-grade conversation analysis designed for clarity and understanding
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Complete Privacy</h3>
              <p className="text-slate-600">Your conversations are encrypted and automatically deleted after analysis. We never store or share your personal data.</p>
            </div>
            
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Unbiased Analysis</h3>
              <p className="text-slate-600">Our AI provides objective analysis without human bias, helping you see patterns you might have missed.</p>
            </div>
            
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Actionable Insights</h3>
              <p className="text-slate-600">Get specific strategies and resources to improve future conversations and build healthier relationships.</p>
            </div>
            
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-600">Get comprehensive analysis results in minutes, not hours. Our advanced processing delivers insights quickly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 backdrop-blur-sm relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">25K+</div>
              <div className="text-slate-600 font-medium">Conversations Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-yellow-600">94%</div>
              <div className="text-slate-600 font-medium">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600">15+</div>
              <div className="text-slate-600 font-medium">Pattern Types Detected</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-500">24/7</div>
              <div className="text-slate-600 font-medium">Available Analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            {/* Floating Question Marks and Exclamation Points */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute text-3xl text-green-400/60" style={{
                animation: 'float 8s ease-in-out infinite',
                left: '10%',
                top: '20%'
              }}>?</div>
              <div className="absolute text-2xl text-yellow-400/60" style={{
                animation: 'float 12s ease-in-out infinite',
                right: '15%',
                top: '30%'
              }}>?</div>
              <div className="absolute text-4xl text-red-400/60" style={{
                animation: 'float 10s ease-in-out infinite',
                left: '25%',
                top: '40%'
              }}>?</div>
              <div className="absolute text-2xl text-green-400/60" style={{
                animation: 'float 15s ease-in-out infinite',
                right: '35%',
                top: '25%'
              }}>?</div>
              <div className="absolute text-3xl text-yellow-400/60" style={{
                animation: 'float 9s ease-in-out infinite',
                left: '50%',
                top: '15%'
              }}>?</div>
              <div className="absolute text-2xl text-red-400/60" style={{
                animation: 'float 11s ease-in-out infinite',
                right: '10%',
                top: '50%'
              }}>?</div>
              <div className="absolute text-2xl text-blue-400/60" style={{
                animation: 'float 13s ease-in-out infinite',
                left: '15%',
                top: '60%'
              }}>?</div>
              <div className="absolute text-3xl text-purple-400/60" style={{
                animation: 'float 7s ease-in-out infinite',
                right: '25%',
                top: '70%'
              }}>?</div>
              <div className="absolute text-2xl text-orange-400/60" style={{
                animation: 'float 14s ease-in-out infinite',
                left: '70%',
                top: '35%'
              }}>?</div>
              <div className="absolute text-3xl text-pink-400/60" style={{
                animation: 'float 16s ease-in-out infinite',
                right: '5%',
                top: '80%'
              }}>?</div>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 relative z-10">
              <span className="block text-transparent bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text transform hover:scale-105 transition-transform duration-300 cursor-default mb-2">
                Frequently Asked
              </span>
              <span className="block text-slate-800 transform hover:-translate-y-1 transition-transform duration-300">
                Questions
              </span>
            </h2>
            <p className="text-lg text-slate-600 relative z-10">
              Everything you need to know about Gaslytics
            </p>
          </div>
          
          <div className="space-y-4 relative">
            {/* Additional floating elements around FAQ boxes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute text-xl text-green-400/40" style={{
                animation: 'float 9.5s ease-in-out infinite',
                left: '5%',
                top: '10%'
              }}>?</div>
              <div className="absolute text-lg text-yellow-400/40" style={{
                animation: 'float 11.5s ease-in-out infinite',
                right: '8%',
                top: '15%'
              }}>?</div>
              <div className="absolute text-xl text-red-400/40" style={{
                animation: 'float 8.5s ease-in-out infinite',
                left: '85%',
                top: '25%'
              }}>?</div>
              <div className="absolute text-lg text-blue-400/40" style={{
                animation: 'float 12.5s ease-in-out infinite',
                right: '12%',
                top: '35%'
              }}>?</div>
              <div className="absolute text-xl text-purple-400/40" style={{
                animation: 'float 10.5s ease-in-out infinite',
                left: '3%',
                top: '45%'
              }}>?</div>
              <div className="absolute text-lg text-orange-400/40" style={{
                animation: 'float 13.5s ease-in-out infinite',
                right: '18%',
                top: '55%'
              }}>?</div>
              <div className="absolute text-xl text-pink-400/40" style={{
                animation: 'float 9.8s ease-in-out infinite',
                left: '92%',
                top: '65%'
              }}>?</div>
              <div className="absolute text-lg text-green-400/40" style={{
                animation: 'float 11.2s ease-in-out infinite',
                right: '2%',
                top: '75%'
              }}>?</div>
              <div className="absolute text-xl text-yellow-400/40" style={{
                animation: 'float 14.2s ease-in-out infinite',
                left: '78%',
                top: '85%'
              }}>?</div>
              <div className="absolute text-lg text-red-400/40" style={{
                animation: 'float 10.8s ease-in-out infinite',
                right: '25%',
                top: '95%'
              }}>?</div>
            </div>
            
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 relative z-10">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600/20 via-yellow-500/30 to-red-500/40 backdrop-blur-sm relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-transparent bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text transform hover:scale-105 transition-transform duration-300 cursor-default mb-2">
              Ready to Understand
            </span>
            <span className="block text-slate-800 transform hover:-translate-y-1 transition-transform duration-300">
              Your Conversations?
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who have gained clarity and insight through professional conversation analysis.
          </p>
          <Link
            to="/consent"
            className="inline-flex items-center px-12 py-6 text-xl font-semibold text-white bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
          >
            <Upload className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            Start Your Free Analysis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/95 backdrop-blur-sm border-t border-slate-800/50 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="/logo.png" 
                  alt="Gaslytics Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-white">Gaslytics</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Advanced conversation analysis powered by AI to help you understand what really happened.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 Gaslytics. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-20px) translateX(10px) rotate(5deg);
            }
            50% {
              transform: translateY(-10px) translateX(-15px) rotate(-3deg);
            }
            75% {
              transform: translateY(-30px) translateX(5px) rotate(2deg);
            }
          }
          
          @keyframes gentleBounce {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }
        `
      }} />
    </div>
  );
};

export default LandingPage; 
