import { ChatConfig } from '../config';
import { IntelligentChat } from './App';

declare module 'intelligent-chat-widget' {
  export const IntelligentChat: React.FC<{ config: ChatConfig }>;
} 