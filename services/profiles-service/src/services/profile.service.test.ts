import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { ProfileRepository } from '../repositories/profile.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ForbiddenException } from '@nestjs/common';

jest.mock('../repositories/profile.repository');

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: ProfileRepository,
          useValue: {
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findByFilters: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepository = module.get(ProfileRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should throw ForbiddenException if user tries to update another user profile', async () => {
      const dto: UpdateProfileDto = { bio: 'New bio' };

      await expect(service.updateProfile('profile-id', 'different-user-id', dto)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should create profile if it does not exist', async () => {
      const dto: UpdateProfileDto = { bio: 'New bio' };
      const mockProfile = {
        userId: 'user-id',
        bio: 'New bio',
        skills: [],
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      profileRepository.findById.mockResolvedValue(null);
      profileRepository.create.mockResolvedValue(mockProfile as any);

      const result = await service.updateProfile('user-id', 'user-id', dto);

      expect(result).toEqual(mockProfile);
      expect(profileRepository.create).toHaveBeenCalled();
    });
  });

  describe('searchProfiles', () => {
    it('should search profiles with filters', async () => {
      const filters = { skills: ['react'], minRating: 4.0 };
      const mockProfiles: any[] = [];

      profileRepository.findByFilters.mockResolvedValue(mockProfiles as any);

      const result = await service.searchProfiles(filters);

      expect(result).toEqual(mockProfiles);
      expect(profileRepository.findByFilters).toHaveBeenCalledWith(filters);
    });
  });
});

