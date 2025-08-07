Gaslytics - AI-Powered Conversation Analysis Platform
React
TypeScript
Node.js
TwelveLabs

An intelligent web application that analyzes video conversations to detect manipulation tactics and provide actionable insights for healthier communication patterns.

🚀 Key Features
AI-Powered Analysis: Detects 6 manipulation tactics including gaslighting, blame-shifting, and emotional blackmail twelveLabs.ts:142-149
Multimodal Processing: Analyzes both visual and audio components using TwelveLabs Marengo 2.7 model
Real-time Video Upload: Drag-and-drop interface with progress monitoring and validation
Interactive Results: Timestamped analysis with confidence scores and response recommendations
Persistent Storage: User authentication and conversation history via Supabase integration package.json:13
🏗️ Technical Architecture
Frontend Stack
React 18 with TypeScript for type-safe component development
Vite for fast development and optimized builds package.json:7-8
Tailwind CSS for utility-first styling with custom design system
Framer Motion for smooth page transitions and animations package.json:15
React Router v7 for client-side routing with animated transitions
Backend Architecture
Node.js with TypeScript for backend processing
TwelveLabs SDK for video indexing and multimodal AI analysis
External AI Integration for manipulation tactic detection
File System Integration for dynamic prompt loading
Data & Storage
Supabase for authentication, database, and file storage
Context API for global state management
JSON-structured analysis results with confidence scoring
🔧 Core Implementation Highlights
Video Processing Pipeline
The application implements a sophisticated video analysis workflow:

File Validation: Validates video files before upload
TwelveLabs Integration: Uploads videos to multimodal AI platform
Progress Monitoring: Real-time status tracking with callback functions
AI Analysis: Processes videos using configurable prompts for manipulation detection
Result Processing: Structures analysis data with timestamps and confidence scores
Frontend Architecture
Modern React patterns with clean separation of concerns: LandingPage.tsx:175-234

Component-based Architecture: Modular, reusable components
Context-driven State: Global state management for conversation data
Responsive Design: Mobile-first approach with Tailwind CSS
Animation System: Smooth transitions using Framer Motion
📁 Project Structure
gaslytics/  
├── src/                          # Frontend React application  
│   ├── components/               # Reusable UI components  
│   │   ├── LandingPage.tsx      # Marketing homepage with animations  
│   │   ├── UploadPage.tsx       # File upload with validation  
│   │   ├── ResultsPage.tsx      # Analysis results display  
│   │   └── Navigation.tsx       # Persistent navigation component  
│   └── context/                 # Global state management  
├── backend/                     # Node.js backend services  
│   ├── src/  
│   │   ├── pegasus.ts          # Main analysis orchestrator  
│   │   └── twelveLabs.ts       # Video processing integration  
│   └── prompt.txt              # AI analysis configuration  
└── docs/                       # Project documentation  
🛠️ Development Setup
Prerequisites
Node.js 18+
TwelveLabs API key
Supabase project credentials
Installation
# Install frontend dependencies  
npm install  
  
# Install backend dependencies  
cd backend && npm install  
  
# Set up environment variables  
cp .env.example .env  
# Add your TWELVE_LABS_API_KEY
Development Commands
# Start frontend development server  
npm run dev  
  
# Run backend analysis pipeline  
cd backend && npm run dev  
  
# Build for production  
npm run build
🎯 Engineering Highlights
Type Safety: Full TypeScript implementation across frontend and backend
Error Handling: Comprehensive validation and user-friendly error messages
Modular Design: Clean separation between video processing, AI analysis, and UI components
Performance: Optimized builds with Vite and efficient state management
Scalability: Context-based architecture ready for feature expansion
📊 Technical Achievements
Multimodal AI Integration: Successfully integrated TwelveLabs video understanding platform
Real-time Processing: Implemented progress monitoring for long-running video analysis tasks
Dynamic Configuration: External prompt loading system for flexible AI behavior modification
Modern React Patterns: Hooks, Context API, and functional components throughout
Production Ready: Comprehensive build system with linting and type checking
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lucianlavric/Gaslytics)
