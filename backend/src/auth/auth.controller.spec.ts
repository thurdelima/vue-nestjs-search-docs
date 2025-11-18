import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully and return access token and user', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'senha123',
      };

      const expectedResult = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'user-id',
          email: 'user@example.com',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(service.login).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Email ou senha inválidos'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.login(loginDto)).rejects.toThrow(
        'Email ou senha inválidos',
      );
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });

    it('should call authService.login with correct LoginDto', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        access_token: 'token',
        user: {
          id: 'id',
          email: 'test@example.com',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(service.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProfile', () => {
    it('should return user profile when authenticated', async () => {
      const mockUser = {
        userId: 'user-id',
        email: 'user@example.com',
      };

      const expectedUser = {
        id: 'user-id',
        email: 'user@example.com',
        password: 'hashed-password',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.validateUser.mockResolvedValue(expectedUser);

      const result = await controller.getProfile(mockUser);

      expect(result).toEqual(expectedUser);
      expect(service.validateUser).toHaveBeenCalledWith('user-id');
      expect(service.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should call authService.validateUser with userId from CurrentUser decorator', async () => {
      const mockUser = {
        userId: 'test-user-id',
        email: 'test@example.com',
      };

      const expectedUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'hashed',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.validateUser.mockResolvedValue(expectedUser);

      await controller.getProfile(mockUser);

      expect(service.validateUser).toHaveBeenCalledWith('test-user-id');
      expect(service.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle when user is not found', async () => {
      const mockUser = {
        userId: 'non-existent-id',
        email: 'test@example.com',
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      const result = await controller.getProfile(mockUser);

      expect(result).toBeNull();
      expect(service.validateUser).toHaveBeenCalledWith('non-existent-id');
    });

    it('should propagate errors from authService.validateUser', async () => {
      const mockUser = {
        userId: 'user-id',
        email: 'user@example.com',
      };

      const error = new Error('Database error');
      mockAuthService.validateUser.mockRejectedValue(error);

      await expect(controller.getProfile(mockUser)).rejects.toThrow(
        'Database error',
      );
      expect(service.validateUser).toHaveBeenCalledWith('user-id');
    });
  });
});

