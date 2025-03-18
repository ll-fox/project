export interface ChatConfig {
  apiKey: string;
  socketUrl?: string;
  botAppKey?: string;
  visitorBizId?: string;
  sessionId?: string;
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