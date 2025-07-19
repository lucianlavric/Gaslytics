import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConversationData {
  relationship: string;
  context: string;
  tags: string[];
  emotionalTone: string;
  videoFile: File | null;
  conversationId?: string; // Add this
}

interface ConversationContextType {
  conversationData: ConversationData;
  updateConversationData: (data: Partial<ConversationData>) => void;
  updateVideoFile: (file: File) => void;
  setConversationId: (id: string) => void; // Add this
  resetConversation: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversationData, setConversationData] = useState<ConversationData>({
    relationship: '',
    context: '',
    tags: [],
    emotionalTone: '',
    videoFile: null,
    conversationId: undefined,
  });

  const updateConversationData = (data: Partial<ConversationData>) => {
    setConversationData(prev => ({ ...prev, ...data }));
  };

  const updateVideoFile = (file: File) => {
    setConversationData(prev => ({ ...prev, videoFile: file }));
  };

  const setConversationId = (id: string) => {
    setConversationData(prev => ({ ...prev, conversationId: id }));
  };

  const resetConversation = () => {
    setConversationData({
      relationship: '',
      context: '',
      tags: [],
      emotionalTone: '',
      videoFile: null,
      conversationId: undefined,
    });
  };

  return (
    <ConversationContext.Provider
      value={{
        conversationData,
        updateConversationData,
        updateVideoFile,
        setConversationId,
        resetConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};