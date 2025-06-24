import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsNotEmpty, Min, Max } from 'class-validator';

export class SingleModelTestDto {
  @ApiPropertyOptional({
    description: '테스트할 AI 모델명',
    example: 'meta-llama/llama-3.1-8b-instruct:free',
    default: 'meta-llama/llama-3.1-8b-instruct:free',
  })
  @IsOptional()
  @IsString()
  modelName?: string;

  @ApiPropertyOptional({
    description: '모델에게 보낼 프롬프트',
    example: 'Hello, how are you?',
    default: 'Hello, how are you?',
  })
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiPropertyOptional({
    description: '온도 파라미터 (0.0 ~ 2.0)',
    example: 0.7,
    minimum: 0,
    maximum: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional({
    description: '최대 토큰 수',
    example: 150,
    minimum: 1,
    maximum: 4000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4000)
  maxTokens?: number;
}

export class BatchTestDto {
  @ApiProperty({
    description: '테스트할 모델 목록',
    example: [
      'meta-llama/llama-3.1-8b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  models: string[];

  @ApiProperty({
    description: '모델들에게 보낼 공통 프롬프트',
    example: 'Explain quantum computing in simple terms',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({
    description: '모델 설정 파라미터',
    type: 'object',
    properties: {
      temperature: {
        type: 'number',
        description: '온도 파라미터',
        example: 0.5,
        minimum: 0,
        maximum: 2,
      },
      maxTokens: {
        type: 'number',
        description: '최대 토큰 수',
        example: 200,
        minimum: 1,
        maximum: 4000,
      },
    },
  })
  @IsOptional()
  config?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export class ModelStatusQueryDto {
  @ApiPropertyOptional({
    description: '상태를 확인할 모델명',
    example: 'meta-llama/llama-3.1-8b-instruct:free',
  })
  @IsOptional()
  @IsString()
  model?: string;
}