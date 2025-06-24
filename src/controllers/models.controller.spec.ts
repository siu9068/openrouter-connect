import { Test, TestingModule } from '@nestjs/testing';
import { ModelsController } from './models.controller';
import { ModelTestingService } from '../services/model-testing.service';

describe('ModelsController', () => {
  let controller: ModelsController;
  let service: ModelTestingService;

  const mockModelTestingService = {
    testSingleModel: jest.fn().mockResolvedValue({
      modelName: 'test-model',
      timestamp: new Date(),
      status: 'success',
      responseTime: 1000,
      response: 'Test response',
    }),
    batchTest: jest.fn().mockResolvedValue({
      results: [],
      summary: {
        totalTests: 0,
        successCount: 0,
        failureCount: 0,
        timeoutCount: 0,
        averageResponseTime: 0,
      },
    }),
    getModelStatus: jest.fn().mockResolvedValue({
      modelName: 'test-model',
      status: 'online',
      lastChecked: new Date(),
      responseTime: 500,
    }),
    getAvailableModels: jest
      .fn()
      .mockReturnValue([
        'meta-llama/llama-3.1-8b-instruct:free',
        'mistralai/mistral-7b-instruct:free',
      ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelsController],
      providers: [
        {
          provide: ModelTestingService,
          useValue: mockModelTestingService,
        },
      ],
    }).compile();

    controller = module.get<ModelsController>(ModelsController);
    service = module.get<ModelTestingService>(ModelTestingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should test single model', async () => {
    const testDto = {
      modelName: 'test-model',
      prompt: 'Hello',
      temperature: 0.7,
      maxTokens: 100,
    };

    const result = await controller.testSingleModel(testDto);

    expect(service.testSingleModel as jest.Mock).toHaveBeenCalledWith(
      testDto.modelName,
      testDto.prompt,
      { temperature: testDto.temperature, maxTokens: testDto.maxTokens },
    );
    expect(result).toHaveProperty('modelName');
    expect(result).toHaveProperty('status');
  });

  it('should handle batch test', async () => {
    const batchRequest = {
      models: ['model1', 'model2'],
      prompt: 'Test prompt',
    };

    const result = await controller.batchTest(batchRequest);

    expect(service.batchTest as jest.Mock).toHaveBeenCalledWith(batchRequest);
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('summary');
  });

  it('should get model status', async () => {
    const modelName = 'test-model';
    const result = await controller.getModelStatus(modelName);

    expect(service.getModelStatus as jest.Mock).toHaveBeenCalledWith(modelName);
    expect(result).toHaveProperty('modelName');
    expect(result).toHaveProperty('status');
  });

  it('should get available models', () => {
    const result = controller.getAvailableModels();

    expect(service.getAvailableModels as jest.Mock).toHaveBeenCalled();
    expect(result).toHaveProperty('models');
    expect(Array.isArray(result.models)).toBe(true);
  });

  it('should return health check', () => {
    const result = controller.healthCheck();

    expect(result).toHaveProperty('status', 'healthy');
    expect(result).toHaveProperty('timestamp');
  });
});
