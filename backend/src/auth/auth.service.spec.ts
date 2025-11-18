import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    validateUser: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully and return access token and user', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'senha123',
      };

      const mockUser = {
        id: 'user-id',
        email: 'user@example.com',
        password: 'hashed-password',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

      mockUsersService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      });

      expect(usersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(usersService.validateUser).toHaveBeenCalledTimes(1);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Email ou senha inválidos',
      );

      expect(usersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user validation returns null', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'senha123',
      };

      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(usersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should create JWT payload with correct email and sub', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password: 'hashed',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedToken = 'token123';

      mockUsersService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(expectedToken);

      await service.login(loginDto);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 'test-id',
      });
    });

    it('should return user without password', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'senha123',
      };

      const mockUser = {
        id: 'user-id',
        email: 'user@example.com',
        password: 'hashed-password',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.login(loginDto);

      expect(result.user).not.toHaveProperty('password');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should propagate errors from usersService.validateUser', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'senha123',
      };

      const error = new Error('Database error');
      mockUsersService.validateUser.mockRejectedValue(error);

      await expect(service.login(loginDto)).rejects.toThrow('Database error');

      expect(usersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user when found', async () => {
      const userId = 'user-id';
      const expectedUser = {
        id: 'user-id',
        email: 'user@example.com',
        password: 'hashed-password',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(expectedUser);

      const result = await service.validateUser(userId);

      expect(result).toEqual(expectedUser);
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when user is not found', async () => {
      const userId = 'non-existent-id';

      mockUsersService.findOne.mockResolvedValue(null);

      const result = await service.validateUser(userId);

      expect(result).toBeNull();
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should propagate errors from usersService.findOne', async () => {
      const userId = 'user-id';
      const error = new Error('Database error');

      mockUsersService.findOne.mockRejectedValue(error);

      await expect(service.validateUser(userId)).rejects.toThrow(
        'Database error',
      );

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should call usersService.findOne with correct userId', async () => {
      const userId = 'test-user-id';
      const expectedUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'hashed',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(expectedUser);

      await service.validateUser(userId);

      expect(usersService.findOne).toHaveBeenCalledWith('test-user-id');
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
    });
  });
});

