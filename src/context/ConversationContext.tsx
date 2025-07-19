import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConversationData {
  consent: boolean;
  relationship: string;
  context: string;
  tags: string[];
  emotionalTone: string;
  videoFile?: File;
}

interface ConversationContextType {
  conversationData: ConversationData;
  updateContext: (data: Partial<ConversationData>) => void;
  updateVideoFile: (file: File) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversationData, setConversationData] = useState<ConversationData>({
    consent: false,
    relationship: '',
    context: '',
    tags: [],
    emotionalTone: ''
  });

  const updateContext = (data: Partial<ConversationData>) => {
    setConversationData(prev => ({ ...prev, ...data }));
  };

  const updateVideoFile = (file: File) => {
    setConversationData(prev => ({ ...prev, videoFile: file }));
  };

  return (
    <ConversationContext.Provider value={{
      conversationData,
      updateContext,
      updateVideoFile
    }}>
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