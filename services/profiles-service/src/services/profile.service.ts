import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProfileRepository } from '../repositories/profile.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(profileId: string): Promise<Profile | null> {
    return this.profileRepository.findById(profileId);
  }

  async updateProfile(
    profileId: string,
    userId: string,
    dto: UpdateProfileDto
  ): Promise<Profile> {
    // Ensure user can only update their own profile
    if (profileId !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const existingProfile = await this.profileRepository.findById(profileId);
    if (!existingProfile) {
      // Create profile if it doesn't exist
      return this.profileRepository.create({
        userId: profileId,
        ...dto,
      });
    }

    return this.profileRepository.update(profileId, dto);
  }

  async searchProfiles(filters: {
    skills?: string[];
    role?: string;
    minRating?: number;
  }): Promise<Profile[]> {
    return this.profileRepository.findByFilters(filters);
  }
}

