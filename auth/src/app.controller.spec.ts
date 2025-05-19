import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let authService: AuthService;
  let mongod: MongoMemoryServer;
  let mongoClient: MongoClient;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();

    authService = new AuthService();
    (authService as any).uri = uri;

    appService = new AppService(
      authService,
      new JwtService({ secret: 'test' }),
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appService }],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongod.stop();
  });

  it('회원가입(register) 성공', async () => {
    const result = await appController.register({
      id: 'testuser',
      password: 'pw',
      role: 'USER',
    });
    expect(result).toEqual({ success: true, message: 'User registered' });
  });

  it('회원가입(register) 중복', async () => {
    await appController.register({
      id: 'dupuser',
      password: 'pw',
      role: 'USER',
    });
    const result = await appController.register({
      id: 'dupuser',
      password: 'pw',
      role: 'USER',
    });
    expect(result).toEqual({ success: false, message: 'User already exists' });
  });

  it('로그인(login) 성공', async () => {
    await appController.register({
      id: 'loginuser',
      password: 'pw',
      role: 'USER',
    });
    const result = await appController.login({
      id: 'loginuser',
      password: 'pw',
    });
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('access_token');
  });

  it('로그인(login) 실패', async () => {
    const result = await appController.login({
      id: 'nouser',
      password: 'wrong',
    });
    expect(result.success).toBe(false);
  });
});
