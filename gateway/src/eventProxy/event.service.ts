import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventService {
  constructor(@Inject('EventProxy') private readonly eventProxy: ClientProxy) {}

  async eventNew(req: any): Promise<any> {
    return firstValueFrom(this.eventProxy.send('event_new', req));
  }

  async eventLog(req: any): Promise<any> {
    return firstValueFrom(this.eventProxy.send('event_log', req));
  }

  async rewardNew(req: any): Promise<any> {
    return firstValueFrom(this.eventProxy.send('reward_new', req));
  }

  async rewardLog(req: any): Promise<any> {
    return firstValueFrom(this.eventProxy.send('reward_log', req));
  }

  async rewardClaim(req: any): Promise<any> {
    return firstValueFrom(this.eventProxy.send('reward_claim', req));
  }

  async rewardClaimLog(req: any): Promise<any> {
    return firstValueFrom(this.eventProxy.send('reward_claim_log', req));
  }

  // FOR DEMO
  async rewardValid(req: any): Promise<any> {
    return firstValueFrom(this.eventProxy.send('reward_valid', req));
  }
}
