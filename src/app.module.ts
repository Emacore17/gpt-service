import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from 'ormconfig';
import { ThreadModule } from './thread/thread.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    OpenaiModule,
    TypeOrmModule.forRootAsync({ useFactory: getConfig }),
    ThreadModule,
    UserModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
