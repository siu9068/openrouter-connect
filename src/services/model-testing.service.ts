import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { logger } from '../config/logger.config';
import {
  TestResponse,
  ModelConfig,
  BatchTestRequest,
  BatchTestResponse,
  ModelStatusResponse,
} from '../interfaces/model.interface';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ModelTestingService {
  private readonly openRouterApiKey: string;
  private readonly defaultModel: string;

  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
    this.defaultModel =
      process.env.DEFAULT_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

    if (!this.openRouterApiKey) {
      logger.warn('OPENROUTER_API_KEY not set. Model testing will fail.');
    }
  }

  async testSingleModel(
    modelName: string = this.defaultModel,
    prompt: string = 'Hello, how are you?',
    config?: Partial<ModelConfig['parameters']>,
  ): Promise<TestResponse> {
    const startTime = Date.now();
    const timestamp = new Date();

    try {
      logger.info(`Testing model: ${modelName} with prompt: "${prompt}"`);

      const model = new ChatOpenAI({
        model: modelName,
        temperature: config?.temperature || 0.7,
        maxTokens: config?.maxTokens || 150,
        openAIApiKey: this.openRouterApiKey,
        configuration: {
          baseURL: 'https://openrouter.ai/api/v1',
          // defaultHeaders: {
          //   'HTTP-Referer': 'http://localhost:3000',
          //   'X-Title': 'Open Router Connect',
          // },
        },
      });

      const response = await model.invoke(prompt);
      const responseTime = Date.now() - startTime;

      const testResponse: TestResponse = {
        modelName,
        timestamp,
        status: 'success',
        responseTime,
        response: response.content as string,
      };

      logger.info(`Model test successful for ${modelName}`, {
        responseTime,
        responseLength: response.content.length,
      });

      return testResponse;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      logger.error(`Model test failed for ${modelName}`, {
        error: errorMessage,
        responseTime,
      });

      const testResponse: TestResponse = {
        modelName,
        timestamp,
        status: responseTime > 30000 ? 'timeout' : 'failure',
        responseTime,
        error: errorMessage,
      };

      return testResponse;
    }
  }

  async batchTest(request: BatchTestRequest): Promise<BatchTestResponse> {
    logger.info(`Starting batch test for ${request.models.length} models`);

    const results = await Promise.all(
      request.models.map((modelName) =>
        this.testSingleModel(modelName, request.prompt, request.config),
      ),
    );

    const summary = {
      totalTests: results.length,
      successCount: results.filter((r) => r.status === 'success').length,
      failureCount: results.filter((r) => r.status === 'failure').length,
      timeoutCount: results.filter((r) => r.status === 'timeout').length,
      averageResponseTime:
        results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
    };

    logger.info('Batch test completed', summary);

    return {
      results,
      summary,
    };
  }

  async getModelStatus(
    modelName: string = this.defaultModel,
  ): Promise<ModelStatusResponse> {
    try {
      const testResult = await this.testSingleModel(modelName, 'ping', {
        temperature: 0,
        maxTokens: 1,
      });

      return {
        modelName,
        status: testResult.status === 'success' ? 'online' : 'offline',
        lastChecked: new Date(),
        responseTime: testResult.responseTime,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to get status for model ${modelName}`, {
        error: errorMessage,
      });

      return {
        modelName,
        status: 'unknown',
        lastChecked: new Date(),
      };
    }
  }

  getAvailableModels(): string[] {
    const commonModels = [
      'meta-llama/llama-3.1-8b-instruct:free',
      'meta-llama/llama-3.1-70b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'google/gemma-7b-it:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'openai/gpt-3.5-turbo',
      'openai/gpt-4',
      'anthropic/claude-3-sonnet',
      'google/gemini-pro',
    ];

    logger.info('Returning list of available models');
    return commonModels;
  }
}
