import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { Message } from 'src/db/entities/message.entity';
import { Thread } from 'src/db/entities/thread.entity';
import { User } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpenaiService {
  private openai = new OpenAI({
    apiKey: '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',
  });

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Thread) private threadRepository: Repository<Thread>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async createAssistant() {
    // Implementa la creazione dell'assistente
    const assistant = await this.openai.beta.assistants.create({
      name: 'Math Tutor',
      instructions:
        'You are a personal math tutor. Write and run code to answer math questions.',
      model: 'gpt-3.5-turbo-1106',
    });

    return assistant.id;
  }

  async createThread(userId: number) {
    // Cerca l'utente nel DB
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Utente non trovato');
    }

    // Crea un thread nel DB e lo associa all'utente
    const thread = this.threadRepository.create({ user });
    await this.threadRepository.save(thread);

    // Crea un thread nelle API OpenAI (assumendo che tu voglia tenere traccia di questo in OpenAI)
    const openAIThread = await this.openai.beta.threads.create({
      // qui puoi passare parametri aggiuntivi se necessario
    });

    thread.openaiThreadId = openAIThread.id;
    await this.threadRepository.save(thread);

    return thread;
  }

  async addMessageToThread(threadId: string, content: string) {
    const thread = await this.threadRepository.findOne({
      where: { openaiThreadId: threadId },
    });
    if (!thread) {
      throw new Error('Thread non trovato');
    }

    // Aggiungi messaggio al thread OpenAI
    const message = await this.openai.beta.threads.messages.create(
      thread.openaiThreadId,
      {
        role: 'user',
        content,
      },
    );

    // Crea e salva un messaggio nel tuo database
    const newMessage = this.messageRepository.create({
      thread,
      content,
      // altri dati necessari, come il timestamp
    });
    await this.messageRepository.save(newMessage);

    return newMessage;
  }

  async runAssistant(
    threadId: string,
    assistantId: string,
    instructions?: string,
  ) {
    const thread = await this.threadRepository.findOne({
      where: { openaiThreadId: threadId },
    });
    if (!thread) {
      throw new Error('Thread non trovato');
    }

    const run = await this.openai.beta.threads.runs.create(
      thread.openaiThreadId,
      {
        assistant_id: assistantId,
        instructions: instructions,
      },
    );

    return run;
  }

  async retrieveRunStatus(threadId: string, runId: string) {
    const thread = await this.threadRepository.findOne({
      where: { openaiThreadId: threadId },
    });
    if (!thread) {
      throw new Error('Thread non trovato');
    }

    const runStatus = await this.openai.beta.threads.runs.retrieve(
      thread.openaiThreadId,
      runId,
    );

    return runStatus;
  }

  async listMessagesInThread(threadId: string) {
    const thread = await this.threadRepository.findOne({
      where: { openaiThreadId: threadId },
    });
    if (!thread) {
      throw new Error('Thread non trovato');
    }

    const messages = await this.messageRepository.find({
      where: { thread: thread },
    });

    return await this.openai.beta.threads.messages.list(threadId);
  }
}
