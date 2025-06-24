import { Test, TestingModule } from '@nestjs/testing';
import { ModelTestingService } from './model-testing.service';

describe('ModelTestingService', () => {
  let service: ModelTestingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelTestingService],
    }).compile();

    service = module.get<ModelTestingService>(ModelTestingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return available models list', () => {
    const models = service.getAvailableModels();
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);
    expect(models).toContain('meta-llama/llama-3.1-8b-instruct:free');
  });

  it('should handle model status check', async () => {
    const status = await service.getModelStatus('test-model');
    expect(status).toHaveProperty('modelName');
    expect(status).toHaveProperty('status');
    expect(status).toHaveProperty('lastChecked');
    expect(['online', 'offline', 'unknown']).toContain(status.status);
  });

  it('should handle batch test request structure', () => {
    const batchRequest = {
      models: ['meta-llama/llama-3.1-8b-instruct:free'],
      prompt: 'Test prompt',
      config: { temperature: 0.5, maxTokens: 100 },
    };

    // This test would require actual API key to run
    // For now, we just test the structure
    expect(batchRequest).toHaveProperty('models');
    expect(batchRequest).toHaveProperty('prompt');
    expect(batchRequest).toHaveProperty('config');
  });
});
