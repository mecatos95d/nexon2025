import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClaimService } from './services/claim.service';
import { EventService } from './services/event.service';
import { RewardService } from './services/reward.service';

@Controller()
export class AppController {
  constructor(
    private readonly claimService: ClaimService,
    private readonly eventService: EventService,
    private readonly rewardService: RewardService,
  ) {}

  @MessagePattern('event_new')
  async eventNew(@Payload() body) {
    return this.eventService.eventNew(body);
  }

  @MessagePattern('event_log')
  async eventLog(@Payload() body) {
    return this.eventService.eventLog(body);
  }

  @MessagePattern('reward_new')
  async rewardNew(@Payload() body) {
    return this.rewardService.rewardNew(body);
  }

  @MessagePattern('reward_log')
  async rewardLog(@Payload() body) {
    return this.rewardService.rewardLog(body);
  }

  @MessagePattern('reward_claim')
  async rewardClaim(@Payload() body) {
    return this.claimService.rewardClaim(body);
  }

  @MessagePattern('reward_claim_log')
  async rewardClaimLog(@Payload() body) {
    return this.claimService.rewardClaimLog(body);
  }
}
