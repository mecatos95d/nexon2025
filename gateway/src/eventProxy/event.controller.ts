import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
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
    return this.eventService.eventNew(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Get('event_log')
  async eventLog(@Request() req) {
    return this.eventService.eventLog(req);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post('reward_new')
  async rewardNew(@Request() req) {
    return this.eventService.rewardNew(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Get('reward_log')
  async rewardLog(@Request() req) {
    return this.eventService.rewardLog(req);
  }
  @UseGuards(JwtAuthGuard)
  @Post('reward_claim')
  async rewardClaim(@Request() req) {
    return this.eventService.rewardClaim(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AUDITOR', 'OPERATOR')
  @Get('reward_claim_log')
  async rewardClaimLog(@Request() req) {
    return this.eventService.rewardClaimLog(req);
  }
}
