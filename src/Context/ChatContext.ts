import { InputContent } from '@google/generative-ai';
import React, { createContext, useContext } from 'react';

export interface ChatContextProps {
  isChatStarted: boolean;
  setIsChatStarted: React.Dispatch<React.SetStateAction<boolean>>;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chatHistory: InputContent[];
  setChatHistory: React.Dispatch<React.SetStateAction<InputContent[]>>;
  chatTitle: string | undefined;
  setChatTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  chatId: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  menuContainerVisible: boolean;
  setMenuContainerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  conversationType: string;
  setConversationType: React.Dispatch<React.SetStateAction<string>>;
}

export const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Custom hook to consume the context
const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export default useChatContext;