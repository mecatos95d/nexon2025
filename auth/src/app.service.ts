import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async login(id: string, password: string) {
    const user = await this.authService.validateUser(id, password);
    if (!user) throw new Error('Invalid credentials');

    const payload = (({ id, role }) => ({ id, role }))(user);

    return { success: true, access_token: this.jwtService.sign(payload) };
  }

  async register(id: string, password: string, role: string) {
    const exists = await this.authService.findUserById(id);
    if (exists) {
      return { success: false, message: 'User already exists' };
    }
    if (!['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'].includes(role)) {
      return { success: false, message: 'Invalid role' };
    }
    await this.authService.register(id, password, role);
    return { success: true, message: 'User registered' };
  }
}
