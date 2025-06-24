import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsController } from './controllers/models.controller';
import { ModelTestingService } from './services/model-testing.service';

@Module({
  imports: [],
  controllers: [AppController, ModelsController],
  providers: [AppService, ModelTestingService],
})
export class AppModule {}
