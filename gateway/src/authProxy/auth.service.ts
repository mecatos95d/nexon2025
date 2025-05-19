import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AuthProxy') private readonly authProxy: ClientProxy) {}

  async login(id: string, password: string): Promise<any> {
    return firstValueFrom(this.authProxy.send('login', { id, password }));
  }

  async register(id: string, password: string, role?: string): Promise<any> {
    return firstValueFrom(
      this.authProxy.send('register', { id, password, role }),
    );
  }
}
