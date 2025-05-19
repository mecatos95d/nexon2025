import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: { id: string; password: string }) {
    return this.authService.login(body.id, body.password);
  }

  @Post('/register')
  async register(
    @Body() body: { id: string; password: string; role?: string },
  ) {
    return this.authService.register(body.id, body.password, body.role);
  }
}
