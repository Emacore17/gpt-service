import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('create-assistant')
  async createAssistant() {
    return this.openaiService.createAssistant();
  }

  @Post('create-thread/:userId')
  async createThread(@Param('userId') userId: number) {
    return this.openaiService.createThread(userId);
  }

  @Post('add-message')
  async addMessageToThread(
    @Body() addMessageDto: { threadId: string; content: string },
  ) {
    return this.openaiService.addMessageToThread(
      addMessageDto.threadId,
      addMessageDto.content,
    );
  }

  @Post('run-assistant')
  async runAssistant(
    @Body()
    runAssistantDto: {
      threadId: string;
      assistantId: string;
      instructions?: string;
    },
  ) {
    return this.openaiService.runAssistant(
      runAssistantDto.threadId,
      runAssistantDto.assistantId,
      runAssistantDto.instructions,
    );
  }

  @Get('retrieve-run-status/:threadId/:runId')
  async retrieveRunStatus(
    @Param('threadId') threadId: string,
    @Param('runId') runId: string,
  ) {
    return this.openaiService.retrieveRunStatus(threadId, runId);
  }

  @Get('list-messages/:threadId')
  async listMessagesInThread(@Param('threadId') threadId: string) {
    return this.openaiService.listMessagesInThread(threadId);
  }
}
