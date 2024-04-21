import React, { ReactNode } from "react";
import {ChatContext, ChatContextProps } from "./ChatContext";
import { InputContent } from "@google/generative-ai";

const ChatProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isChatStarted, setIsChatStarted] = React.useState<boolean>(false);
    const [showMenu, setShowMenu] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [chatHistory, setChatHistory] = React.useState<InputContent[]>([]);
    const [chatTitle, setChatTitle] = React.useState<string>();
    const [chatId, setChatId] = React.useState<string>('');
    const [menuContainerVisible, setMenuContainerVisible] = React.useState<boolean>(false);
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
    }
    return(
        <ChatContext.Provider
            value={ContextValues}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider;