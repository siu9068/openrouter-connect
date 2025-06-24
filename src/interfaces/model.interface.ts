export interface TestResponse {
  modelName: string;
  timestamp: Date;
  status: 'success' | 'failure' | 'timeout';
  responseTime: number;
  response?: string;
  error?: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ModelConfig {
  name: string;
  endpoint: string;
  parameters: {
    temperature: number;
    maxTokens: number;
  };
}

export interface BatchTestRequest {
  models: string[];
  prompt: string;
  config?: Partial<ModelConfig['parameters']>;
}

export interface BatchTestResponse {
  results: TestResponse[];
  summary: {
    totalTests: number;
    successCount: number;
    failureCount: number;
    timeoutCount: number;
    averageResponseTime: number;
  };
}

export interface ModelStatusResponse {
  modelName: string;
  status: 'online' | 'offline' | 'unknown';
  lastChecked: Date;
  responseTime?: number;
}
