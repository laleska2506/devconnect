import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { User, UserRole } from '../entities/user.entity';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('../repositories/user.repository');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRole.FREELANCER,
      };

      userRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      userRepository.create.mockResolvedValue({
        id: 'user-id',
        ...registerDto,
        passwordHash: 'hashed_password',
        createdAt: new Date(),
      } as User);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe(registerDto.email);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRole.FREELANCER,
      };

      userRepository.findByEmail.mockResolvedValue({
        id: 'existing-id',
        email: registerDto.email,
      } as User);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const user = {
        id: 'user-id',
        email: loginDto.email,
        passwordHash: 'hashed_password',
        name: 'John Doe',
        role: UserRole.FREELANCER,
      } as User;

      userRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe(loginDto.email);
    });

    it('should throw UnauthorizedException with invalid email', async () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const loginDto = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 'user-id',
        email: loginDto.email,
        passwordHash: 'hashed_password',
      } as User;

      userRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});

