import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>
  ) {}

  async findById(userId: string): Promise<Profile | null> {
    return this.repository.findOne({ where: { userId } });
  }

  async create(profile: Partial<Profile>): Promise<Profile> {
    const newProfile = this.repository.create(profile);
    return this.repository.save(newProfile);
  }

  async update(userId: string, profile: Partial<Profile>): Promise<Profile> {
    await this.repository.update({ userId }, profile);
    return this.findById(userId) as Promise<Profile>;
  }

  async findByFilters(filters: {
    skills?: string[];
    role?: string;
    minRating?: number;
  }): Promise<Profile[]> {
    const query = this.repository.createQueryBuilder('profile');

    if (filters.skills && filters.skills.length > 0) {
      query.andWhere('profile.skills && :skills', { skills: filters.skills });
    }

    if (filters.minRating !== undefined) {
      query.andWhere('profile.rating >= :minRating', { minRating: filters.minRating });
    }

    return query.getMany();
  }
}

