import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './authProxy/auth.controller';
import { AuthService } from './authProxy/auth.service';
import { EventController } from './eventProxy/event.controller';
import { EventService } from './eventProxy/event.service';

@Module({
  imports: [AuthModule],
  controllers: [AuthController, EventController],
  providers: [
    AuthService,
    EventService,
    {
      provide: 'AuthProxy',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'auth',
            port: 4000,
          },
        });
      },
    },
    {
      provide: 'EventProxy',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'event',
            port: 4001,
          },
        });
      },
    },
  ],
})
export class AppModule {}
