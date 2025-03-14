import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [ChatGateway, ChatService],
})
export class AppModule {}