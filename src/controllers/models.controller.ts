import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ModelTestingService } from '../services/model-testing.service';
import {
  TestResponse,
  BatchTestResponse,
  ModelStatusResponse,
} from '../interfaces/model.interface';
import { logger } from '../config/logger.config';
import {
  SingleModelTestDto,
  BatchTestDto,
  ModelStatusQueryDto,
} from '../dto/model-test.dto';
import {
  TestResponseDto,
  BatchTestResponseDto,
  ModelStatusResponseDto,
  AvailableModelsResponseDto,
  HealthCheckResponseDto,
} from '../dto/response.dto';

@ApiTags('models')
@Controller('api/models')
export class ModelsController {
  constructor(private readonly modelTestingService: ModelTestingService) {}

  @Post('test')
  @ApiOperation({
    summary: '단일 AI 모델 테스트',
    description: '지정된 AI 모델에 프롬프트를 보내고 응답을 받아 성능을 테스트합니다.',
  })
  @ApiBody({ type: SingleModelTestDto })
  @ApiResponse({
    status: 200,
    description: '모델 테스트 성공',
    type: TestResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '모델 테스트 실패',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Model test failed: API key not found' },
      },
    },
  })
  async testSingleModel(
    @Body() testDto: SingleModelTestDto,
  ): Promise<TestResponse> {
    try {
      logger.info('Single model test request received', testDto);

      const config = {
        temperature: testDto.temperature,
        maxTokens: testDto.maxTokens,
      };

      const result = await this.modelTestingService.testSingleModel(
        testDto.modelName,
        testDto.prompt,
        config,
      );

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('Single model test failed', { error: errorMessage });
      throw new HttpException(
        'Model test failed: ' + errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('batch-test')
  @ApiOperation({
    summary: '여러 AI 모델 배치 테스트',
    description: '여러 AI 모델에 동일한 프롬프트를 보내고 성능을 비교 분석합니다.',
  })
  @ApiBody({ type: BatchTestDto })
  @ApiResponse({
    status: 200,
    description: '배치 테스트 성공',
    type: BatchTestResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 500, description: '배치 테스트 실패' })
  async batchTest(
    @Body() batchRequest: BatchTestDto,
  ): Promise<BatchTestResponse> {
    try {
      logger.info('Batch test request received', {
        modelCount: batchRequest.models.length,
        prompt: batchRequest.prompt,
      });

      if (!batchRequest.models || batchRequest.models.length === 0) {
        throw new HttpException(
          'Models array is required and cannot be empty',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!batchRequest.prompt) {
        throw new HttpException('Prompt is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.modelTestingService.batchTest(batchRequest);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('Batch test failed', { error: errorMessage });
      throw new HttpException(
        'Batch test failed: ' + errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status')
  @ApiOperation({
    summary: 'AI 모델 상태 확인',
    description: '특정 AI 모델의 연결 상태와 응답 시간을 확인합니다.',
  })
  @ApiQuery({
    name: 'model',
    required: false,
    description: '상태를 확인할 모델명 (생략 시 기본 모델)',
    example: 'meta-llama/llama-3.1-8b-instruct:free',
  })
  @ApiResponse({
    status: 200,
    description: '모델 상태 조회 성공',
    type: ModelStatusResponseDto,
  })
  @ApiResponse({ status: 500, description: '상태 확인 실패' })
  async getModelStatus(
    @Query('model') modelName?: string,
  ): Promise<ModelStatusResponse> {
    try {
      logger.info('Model status check requested', { modelName });

      const result = await this.modelTestingService.getModelStatus(modelName);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('Model status check failed', { error: errorMessage });
      throw new HttpException(
        'Status check failed: ' + errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('available')
  @ApiOperation({
    summary: '사용 가능한 AI 모델 목록',
    description: '현재 시스템에서 테스트 가능한 모든 AI 모델의 목록을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모델 목록 조회 성공',
    type: AvailableModelsResponseDto,
  })
  @ApiResponse({ status: 500, description: '모델 목록 조회 실패' })
  getAvailableModels(): { models: string[] } {
    try {
      logger.info('Available models list requested');

      const models = this.modelTestingService.getAvailableModels();
      return { models };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to get available models', { error: errorMessage });
      throw new HttpException(
        'Failed to get available models: ' + errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @ApiTags('health')
  @ApiOperation({
    summary: '시스템 헬스 체크',
    description: 'AI 모델 검증 시스템의 상태를 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '시스템 정상 상태',
    type: HealthCheckResponseDto,
  })
  healthCheck(): { status: string; timestamp: Date } {
    logger.info('Health check requested');
    return {
      status: 'healthy',
      timestamp: new Date(),
    };
  }
}
