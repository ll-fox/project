"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const chat_gateway_1 = require("./chat.gateway");
let ChatService = class ChatService {
    constructor(httpService, chatGateway) {
        this.httpService = httpService;
        this.chatGateway = chatGateway;
    }
    generateResponse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://wss.lke.cloud.tencent.com/v1/qbot/chat/sse';
            const payload = {
                content: message,
                bot_app_key: 'jLKUTKgP',
                visitor_biz_id: 'test',
                session_id: 'test',
                visitor_labels: [],
            };
            try {
                const response = yield this.httpService
                    .post(url, payload, {
                    headers: { 'Content-Type': 'application/json' },
                    responseType: 'stream',
                })
                    .toPromise();
                console.log(3333, response === null || response === void 0 ? void 0 : response.data);
                if (!response || !response.data) {
                    throw new Error('No response from AI API');
                }
                let buffer = '';
                response.data.on('data', (chunk) => {
                    var _a, _b;
                    buffer += chunk.toString();
                    // 按行分割 buffer
                    const lines = buffer.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            const jsonStr = line.slice(5).trim(); // 去掉 'data:' 并去除前后空格
                            try {
                                const eventData = JSON.parse(jsonStr);
                                // 确保是 'reply' 事件且包含 payload.content
                                console.log(123456, eventData);
                                if (eventData.type === 'reply'
                                    && ((_a = eventData === null || eventData === void 0 ? void 0 : eventData.payload) === null || _a === void 0 ? void 0 : _a.content)
                                    && ((_b = eventData === null || eventData === void 0 ? void 0 : eventData.payload) === null || _b === void 0 ? void 0 : _b.can_rating)) {
                                    const content = eventData.payload.content;
                                    console.log(1234567, content);
                                    // 将 content 发送到客户端
                                    this.chatGateway.server.emit('receiveMessage', content);
                                }
                            }
                            catch (error) {
                                console.error('Error parsing JSON:', error);
                            }
                        }
                    }
                    // 保留未处理完的部分
                    buffer = lines[lines.length - 1];
                });
                response.data.on('end', () => {
                    console.log('Stream ended');
                });
                response.data.on('error', (err) => {
                    console.error('Stream error:', err);
                });
            }
            catch (error) {
                console.error('Error calling AI API:', error);
                throw new Error('Failed to get AI response');
            }
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __metadata("design:paramtypes", [axios_1.HttpService,
        chat_gateway_1.ChatGateway])
], ChatService);
