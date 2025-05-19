import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { EventService } from './event.service';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post('event_new')
  async eventNew(@Request() req) {
    return this.eventService.eventNew(req.body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post('event_log')
  async eventLog(@Request() req) {
    return this.eventService.eventLog(req.body);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post('reward_new')
  async rewardNew(@Request() req) {
    return this.eventService.rewardNew(req.body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post('reward_log')
  async rewardLog(@Request() req) {
    return this.eventService.rewardLog(req.body);
  }
  @UseGuards(JwtAuthGuard)
  @Post('reward_claim')
  async rewardClaim(@Request() req) {
    const body = { ...req.body, user_id: req.user._id };
    return this.eventService.rewardClaim(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AUDITOR', 'OPERATOR', 'USER')
  @Post('reward_claim_log')
  async rewardClaimLog(@Request() req) {
    const body = { ...req.body, user_id: req.user._id, role: req.user.role };
    return this.eventService.rewardClaimLog(body);
  }

  // FOR DEMO
  @Post('reward_valid')
  async rewardValid(@Request() req) {
    return this.eventService.rewardValid(req.body);
  }
}
