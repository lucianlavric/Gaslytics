import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ConsentPage from './components/ConsentPage';
import UploadPage from './components/UploadPage';
import ResultsPage from './components/ResultsPage';
import SavedConversations from './components/SavedConversations';
import ResourcesPage from './components/ResourcesPage';
import Navigation from './components/Navigation';
import { ConversationProvider } from './context/ConversationContext';

function App() {
  return (
    <ConversationProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-rose-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/saved" element={<SavedConversations />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Routes>
        </div>
      </Router>
    </ConversationProvider>
  );
}

export default App;