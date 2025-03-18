import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ChatGateway } from './chat.gateway';
import { ChatConfig } from './config';

@Injectable()
export class ChatService {
  private config!: ChatConfig; // 使用明确赋值断言

  constructor(
    private httpService: HttpService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway
  ) {}

  // 添加设置配置的方法
  setConfig(config: ChatConfig) {
    this.config = config;
  }

  async generateResponse(message: string): Promise<void> {
    const url = 'https://wss.lke.cloud.tencent.com/v1/qbot/chat/sse';
    const payload = {
      content: message,
      bot_app_key: this.config?.botAppKey || 'jLKUTKgP',
      visitor_biz_id: this.config?.visitorBizId || 'test',
      session_id: this.config?.sessionId || 'test',
      visitor_labels: [],
    };

    try {
      const response = await this.httpService
        .post(url, payload, {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'stream',
        })
        .toPromise();

        console.log(3333, response?.data);
        
      if (!response || !response.data) {
        throw new Error('No response from AI API');
      }

      let buffer = '';

      response.data.on('data', (chunk: Buffer) => {
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
                && eventData?.payload?.content
                && eventData?.payload?.can_rating
              ) {
                const content = eventData.payload.content;
                console.log(1234567, content);

                // 将 content 发送到客户端
                this.chatGateway.server.emit('receiveMessage', content);
              }
            } catch (error) {
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

      response.data.on('error', (err: Error) => {
        console.error('Stream error:', err);
      });
    } catch (error) {
      console.error('Error calling AI API:', error);
      throw new Error('Failed to get AI response');
    }
  }
}