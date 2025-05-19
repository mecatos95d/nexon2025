import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClaimService } from './services/claim.service';
import { EventService } from './services/event.service';
import { RewardService } from './services/reward.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ClaimService, EventService, RewardService],
})
export class AppModule {}
