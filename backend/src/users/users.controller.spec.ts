import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            updatePassword: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { id: '1', email: 'test@example.com' };

      jest.spyOn(usersService, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const userId = 'user-id';
      const expectedResult = { id: userId, email: 'test@example.com' };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(expectedResult as any);

      const result = await controller.findOne(userId);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updatePassword', () => {
    it('should call service to update password', async () => {
      const userId = 'user-id';
      const dto: UpdatePasswordDto = { currentPassword: 'old', newPassword: 'newPass123' };

      jest.spyOn(usersService, 'updatePassword').mockResolvedValue(undefined);

      await controller.updatePassword(userId, dto);

      expect(usersService.updatePassword).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe('remove', () => {
    it('should call service to soft delete user', async () => {
      const userId = 'user-id';

      jest.spyOn(usersService, 'softDelete').mockResolvedValue(undefined);

      await controller.remove(userId);

      expect(usersService.softDelete).toHaveBeenCalledWith(userId);
    });
  });
});
