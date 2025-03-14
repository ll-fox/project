"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligentChat = IntelligentChat;
const react_1 = __importStar(require("react"));
const socket_io_client_1 = require("socket.io-client");
const react_markdown_1 = __importDefault(require("react-markdown"));
const react_draggable_1 = __importDefault(require("react-draggable"));
const context_1 = require("../context");
// 修改 WebSocket 连接端口为 3000
const socket = (0, socket_io_client_1.io)('http://localhost:3000');
function ChatWidget() {
    const config = (0, context_1.useChatConfig)();
    const socket = (0, socket_io_client_1.io)(config.socketUrl || 'http://localhost:3000');
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [input, setInput] = (0, react_1.useState)('');
    const [isTyping, setIsTyping] = (0, react_1.useState)(false);
    const messagesEndRef = (0, react_1.useRef)(null);
    const [showChat, setShowChat] = (0, react_1.useState)(false);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const dragPosition = (0, react_1.useRef)({ x: 0, y: 0 });
    const [lkeComponent, setLkeComponent] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const checkComponent = () => {
            if (window['lke-component']) {
                console.log('lkeComponent loaded:', window['lke-component']);
                setLkeComponent(window['lke-component']);
            }
            else {
                setTimeout(checkComponent, 100);
            }
        };
        checkComponent();
    }, []);
    (0, react_1.useEffect)(() => {
        console.log(12345, lkeComponent);
        if (lkeComponent) {
            console.log('lkeComponent loaded:', lkeComponent);
            // 使用 lkeComponent
        }
    }, [lkeComponent]);
    (0, react_1.useEffect)(() => {
        socket.on('receiveMessage', (content) => {
            setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages.length && !newMessages[newMessages.length - 1].isUser) {
                    newMessages[newMessages.length - 1].text = content;
                }
                else {
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
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    };
    (0, react_1.useEffect)(scrollToBottom, [messages]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        setMessages(prev => [...prev, { text: input, isUser: true }]);
        socket.emit('sendMessage', input);
        setInput('');
        setIsTyping(true);
    };
    const handleDrag = (e, data) => {
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
    return (react_1.default.createElement("div", { className: "fixed bottom-4 right-4 z-50" },
        react_1.default.createElement(react_draggable_1.default, { onDrag: handleDrag, onStop: handleDragStop, position: dragPosition.current },
            react_1.default.createElement("button", { className: "w-12 h-12 bg-blue-500 rounded-full shadow-lg \n                   hover:bg-blue-600 text-white flex items-center \n                   justify-center cursor-move" }, "\uD83D\uDCAC")),
        showChat && (react_1.default.createElement("div", { className: "fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl \n                      animate-fade-in-up" },
            react_1.default.createElement("div", { className: "flex justify-between items-center p-4 border-b" },
                react_1.default.createElement("h2", { className: "text-lg font-semibold" }, "\u667A\u80FD\u95EE\u7B54"),
                react_1.default.createElement("button", { onClick: () => setShowChat(false), className: "text-gray-500 hover:text-gray-700" }, "\u00D7")),
            react_1.default.createElement("div", { className: "h-96 overflow-y-auto p-4" },
                messages.map((message, index) => (react_1.default.createElement("div", { key: index, className: `mb-4 ${message.isUser ? 'text-right' : 'text-left'}` },
                    react_1.default.createElement("div", { className: `inline-block p-3 rounded-lg max-w-[80%] break-words ${message.isUser
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'}` },
                        react_1.default.createElement(react_markdown_1.default, { className: "prose" }, message.text))))),
                isTyping && (react_1.default.createElement("div", { className: "text-gray-500 italic" }, "AI is typing...")),
                react_1.default.createElement("div", { ref: messagesEndRef })),
            react_1.default.createElement("form", { onSubmit: handleSubmit, className: "p-4 border-t" },
                react_1.default.createElement("div", { className: "flex gap-2" },
                    react_1.default.createElement("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), className: "flex-1 p-2 border rounded", placeholder: "Type your message..." }),
                    react_1.default.createElement("button", { type: "submit", className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" }, "Send")))))));
}
function IntelligentChat(props) {
    return (react_1.default.createElement(context_1.ChatProvider, { config: props.config },
        react_1.default.createElement(ChatWidget, null)));
}
