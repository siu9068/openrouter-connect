import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestResponseDto {
  @ApiProperty({
    description: '테스트된 모델명',
    example: 'meta-llama/llama-3.1-8b-instruct:free',
  })
  modelName: string;

  @ApiProperty({
    description: '테스트 실행 시간',
    example: '2025-06-24T11:00:00.000Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: '테스트 결과 상태',
    enum: ['success', 'failure', 'timeout'],
    example: 'success',
  })
  status: 'success' | 'failure' | 'timeout';

  @ApiProperty({
    description: '응답 시간 (밀리초)',
    example: 1500,
  })
  responseTime: number;

  @ApiPropertyOptional({
    description: '모델의 응답 내용',
    example: 'Hello! I am doing well, thank you for asking.',
  })
  response?: string;

  @ApiPropertyOptional({
    description: '에러 메시지 (실패 시)',
    example: 'Model not available',
  })
  error?: string;

  @ApiPropertyOptional({
    description: '토큰 사용량 정보',
    type: 'object',
    properties: {
      promptTokens: { type: 'number', example: 10 },
      completionTokens: { type: 'number', example: 25 },
      totalTokens: { type: 'number', example: 35 },
    },
  })
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class BatchTestSummaryDto {
  @ApiProperty({
    description: '총 테스트 수',
    example: 3,
  })
  totalTests: number;

  @ApiProperty({
    description: '성공한 테스트 수',
    example: 2,
  })
  successCount: number;

  @ApiProperty({
    description: '실패한 테스트 수',
    example: 1,
  })
  failureCount: number;

  @ApiProperty({
    description: '타임아웃된 테스트 수',
    example: 0,
  })
  timeoutCount: number;

  @ApiProperty({
    description: '평균 응답 시간 (밀리초)',
    example: 1750,
  })
  averageResponseTime: number;
}

export class BatchTestResponseDto {
  @ApiProperty({
    description: '각 모델별 테스트 결과',
    type: [TestResponseDto],
  })
  results: TestResponseDto[];

  @ApiProperty({
    description: '배치 테스트 요약',
    type: BatchTestSummaryDto,
  })
  summary: BatchTestSummaryDto;
}

export class ModelStatusResponseDto {
  @ApiProperty({
    description: '모델명',
    example: 'meta-llama/llama-3.1-8b-instruct:free',
  })
  modelName: string;

  @ApiProperty({
    description: '모델 상태',
    enum: ['online', 'offline', 'unknown'],
    example: 'online',
  })
  status: 'online' | 'offline' | 'unknown';

  @ApiProperty({
    description: '마지막 확인 시간',
    example: '2025-06-24T11:00:00.000Z',
  })
  lastChecked: Date;

  @ApiPropertyOptional({
    description: '응답 시간 (밀리초)',
    example: 800,
  })
  responseTime?: number;
}

export class AvailableModelsResponseDto {
  @ApiProperty({
    description: '사용 가능한 모델 목록',
    example: [
      'meta-llama/llama-3.1-8b-instruct:free',
      'meta-llama/llama-3.1-70b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'openai/gpt-3.5-turbo',
    ],
    type: [String],
  })
  models: string[];
}

export class HealthCheckResponseDto {
  @ApiProperty({
    description: '시스템 상태',
    example: 'healthy',
  })
  status: string;

  @ApiProperty({
    description: '현재 시간',
    example: '2025-06-24T11:00:00.000Z',
  })
  timestamp: Date;
}