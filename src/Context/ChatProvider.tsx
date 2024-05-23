import React, { ReactNode, useEffect } from "react";
import {ChatContext, ChatContextProps} from "./ChatContext";
import { InputContent } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isChatStarted, setIsChatStarted] = React.useState<boolean>(false);
    const [showMenu, setShowMenu] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [chatHistory, setChatHistory] = React.useState<InputContent[]>([]);
    const [chatTitle, setChatTitle] = React.useState<string>();
    const [chatId, setChatId] = React.useState<string>('');
    const [menuContainerVisible, setMenuContainerVisible] = React.useState<boolean>(false);
    const [conversationType, setConversationType] = React.useState<string>("balanced");
    const ContextValues: ChatContextProps = {
        isChatStarted,
        setIsChatStarted,
        showMenu,
        setShowMenu,
        isLoading,
        setIsLoading,
        chatHistory,
        setChatHistory,
        chatTitle, 
        setChatTitle,
        chatId,
        setChatId,
        menuContainerVisible,
        setMenuContainerVisible,
        conversationType,
        setConversationType
    }

    const fetchConversationType = async (): Promise<string | null> => {
        try {
          const type = await AsyncStorage.getItem('askGemini_conversation_type');
          return type;
        } catch (error) {
          console.error('Error fetching mode:', error);
          return null; 
        }
      }  

    useEffect(() => {
      const getType = async () => {
        const typeName = await fetchConversationType()
        typeName && setConversationType(typeName) 
      }

      getType();

    }, [conversationType])
    

    return(
        <ChatContext.Provider
            value={ContextValues}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider;