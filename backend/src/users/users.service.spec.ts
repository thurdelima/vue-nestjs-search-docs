import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword';
      const user = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);

      const result = await service.create(createDto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(createDto.email);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createDto.email },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const email = 'test@example.com';
      const user = { id: '1', email, password: 'hashed', isDeleted: false } as User;

      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail(email);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email, isDeleted: false },
      });
      expect(result).toEqual(user);
    });

    it('should return null when not found', async () => {
      const email = 'missing@example.com';

      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return user without password when found', async () => {
      const id = 'user-id';
      const user = {
        id,
        email: 'test@example.com',
        password: 'hashed',
        isDeleted: false,
      } as User;

      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id, isDeleted: false },
      });
      expect(result).toEqual({ id, email: user.email, isDeleted: false });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateUser', () => {
    it('should return null when user is not found', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser('missing@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password does not match', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed',
        isDeleted: false,
      } as User;

      jest.spyOn(service, 'findByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(user.email, 'wrong-password');

      expect(result).toBeNull();
    });

    it('should return user when credentials are valid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed',
        isDeleted: false,
      } as User;

      jest.spyOn(service, 'findByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(user.email, 'password');

      expect(result).toEqual(user);
    });
  });

  describe('updatePassword', () => {
    it('should update password if current password is valid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedCurrentPassword',
        isDeleted: false,
      };

      mockRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
      mockRepository.save.mockResolvedValue({ ...user, password: 'hashedNewPassword' });

      await service.updatePassword('1', {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('currentPassword', 'hashedCurrentPassword');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if current password is invalid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedCurrentPassword',
        isDeleted: false,
      };

      mockRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.updatePassword('1', {
          currentPassword: 'wrongPassword',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should throw NotFoundException if user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updatePassword('missing-id', {
          currentPassword: 'currentPassword',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should mark user as deleted', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        isDeleted: false,
      };

      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.save.mockResolvedValue({ ...user, isDeleted: true });

      await service.softDelete('1');

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isDeleted: true }),
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.softDelete('missing-id')).rejects.toThrow(NotFoundException);
    });
  });
});

