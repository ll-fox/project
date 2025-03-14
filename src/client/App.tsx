import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import ReactMarkdown from 'react-markdown';
import Draggable from 'react-draggable';
import { ChatProvider, useChatConfig } from '../context';
import { ChatConfig } from '@/config';

// 修改 WebSocket 连接端口为 3000
const socket = io('http://localhost:3000');

interface Message {
  text: string;
  isUser: boolean;
}

interface AppProps {
  config: ChatConfig;
}

function ChatWidget() {
  const config = useChatConfig();
  const socket = io(config.socketUrl || 'http://localhost:3000');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showChat, setShowChat] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragPosition = useRef({ x: 0, y: 0 });
  const [lkeComponent, setLkeComponent] = useState<any>(null);

  useEffect(() => {
    const checkComponent = () => {
      if (window['lke-component' as keyof Window]) {
        console.log('lkeComponent loaded:', window['lke-component' as keyof Window]);
        setLkeComponent(window['lke-component' as keyof Window]);
      } else {
        setTimeout(checkComponent, 100);
      }
    };
    checkComponent();
  }, []);

  useEffect(() => {
    console.log(12345, lkeComponent);
    if (lkeComponent) {
      console.log('lkeComponent loaded:', lkeComponent);
      // 使用 lkeComponent
    }
  }, [lkeComponent]);

  useEffect(() => {
    socket.on('receiveMessage', (content: string) => {
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length && !newMessages[newMessages.length - 1].isUser) {
          newMessages[newMessages.length - 1].text = content;
        } else {
          newMessages.push({ text: content, isUser: false });
        }
        return newMessages;
      });
      setIsTyping(false);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    socket.emit('sendMessage', input);
    setInput('');
    setIsTyping(true);
  };

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    if (dragPosition.current.x !== data.x || dragPosition.current.y !== data.y) {
      setIsDragging(true);
    }
    dragPosition.current = data;
  };

  const handleDragStop = () => {
    if (!isDragging) {
      setShowChat(!showChat);
    }
    setIsDragging(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Draggable
        onDrag={handleDrag}
        onStop={handleDragStop}
        position={dragPosition.current}
      >
        <button
          className="w-12 h-12 bg-blue-500 rounded-full shadow-lg 
                   hover:bg-blue-600 text-white flex items-center 
                   justify-center cursor-move"
        >
          💬
        </button>
      </Draggable>

      {showChat && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl 
                      animate-fade-in-up">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">智能问答</h2>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="h-96 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.isUser ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] break-words ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <ReactMarkdown className="prose">{message.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-gray-500 italic">AI is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function IntelligentChat(props: AppProps) {
  return (
    <ChatProvider config={props.config}>
      <ChatWidget />
    </ChatProvider>
  );
}