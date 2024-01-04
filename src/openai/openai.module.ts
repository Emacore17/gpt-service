import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { Thread } from 'src/db/entities/thread.entity';
import { Message } from 'src/db/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Thread, Message])],
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class OpenaiModule {}
