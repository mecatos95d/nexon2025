import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ClaimService } from './services/claim.service';
import { EventService } from './services/event.service';
import { RewardService } from './services/reward.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [ClaimService, EventService, RewardService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
