import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import ConsentPage from "./components/ConsentPage";
import UploadPage from "./components/UploadPage";
import ResultsPage from "./components/ResultsPage";
import DeepInsightsPage from "./components/DeepInsightsPage";
import SavedConversations from "./components/SavedConversations";
import ResourcesPage from "./components/ResourcesPage";
import TwelveLabsTestPage from "./components/TwelveLabsTestPage";
import Navigation from "./components/Navigation";
import { ConversationProvider } from "./context/ConversationContext";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/consent" element={<ConsentPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/deep-insights" element={<DeepInsightsPage />} />
        <Route path="/saved" element={<SavedConversations />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/test-twelveLabs" element={<TwelveLabsTestPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ConversationProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-rose-50">
          <Navigation />
          <AnimatedRoutes />
        </div>
      </Router>
    </ConversationProvider>
  );
}

export default App;
