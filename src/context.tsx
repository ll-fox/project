import React, { createContext, useContext } from 'react';
import { ChatConfig } from './config';

const ChatContext = createContext<ChatConfig>({} as ChatConfig);

export const ChatProvider = ({ children, config }: { 
  children: React.ReactNode;
  config: ChatConfig 
}) => (
  <ChatContext.Provider value={config}>
    {children}
  </ChatContext.Provider>
);

export const useChatConfig = () => useContext(ChatContext); 