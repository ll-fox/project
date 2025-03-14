export interface ChatConfig {
  apiKey: string;
  socketUrl?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    bubbleRadius?: number;
  };
  localization?: {
    placeholder?: string;
    sendButton?: string;
    typingIndicator?: string;
  };
} 