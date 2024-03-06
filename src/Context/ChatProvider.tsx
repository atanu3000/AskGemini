import React, { ReactNode } from "react";
import {ChatContext, ChatContextProps } from "./ChatContext";

const ChatProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isChatStarted, setIsChatStarted] = React.useState<boolean>(false);
    const [showMenu, setShowMenu] = React.useState<boolean>(false);
    const ContextValues: ChatContextProps = {
        isChatStarted,
        setIsChatStarted,
        showMenu,
        setShowMenu
    }
    return(
        <ChatContext.Provider
            value={ContextValues}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider;