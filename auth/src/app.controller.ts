import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('login')
  async login(@Payload() data: { id: string; password: string }) {
    try {
      return await this.appService.login(data.id, data.password);
    } catch (e) {
      return { success: false, message: e.message || 'Login failed' };
    }
  }

  @MessagePattern('register')
  async register(
    @Payload() data: { id: string; password: string; role?: string },
  ) {
    try {
      return await this.appService.register(
        data.id,
        data.password,
        data.role ?? 'USER',
      );
    } catch (e) {
      return { success: false, message: e.message || 'Register failed' };
    }
  }
}
