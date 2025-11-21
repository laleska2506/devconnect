import { Injectable } from '@nestjs/common';
import { Profile } from '../interfaces/profile.interface';

@Injectable()
export class MatchingService {
  // In-memory index of profiles (simulating ElasticSearch)
  // TODO: Replace with real ElasticSearch integration
  private profilesIndex: Profile[] = [];

  constructor() {
    // Seed with some mock data for testing
    this.initializeMockData();
  }

  async searchProfiles(filters: {
    skills?: string[];
    minRating?: number;
  }): Promise<Profile[]> {
    let results = [...this.profilesIndex];

    // Filter by skills (if any skill matches)
    if (filters.skills && filters.skills.length > 0) {
      results = results.filter((profile) =>
        filters.skills!.some((skill) =>
          profile.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
        )
      );
    }

    // Filter by minimum rating
    if (filters.minRating !== undefined) {
      results = results.filter((profile) => profile.rating >= filters.minRating!);
    }

    // Sort by rating (descending)
    results.sort((a, b) => b.rating - a.rating);

    return results;
  }

  // TODO: This would be called by profiles-service when a profile is created/updated
  async indexProfile(profile: Profile): Promise<void> {
    const existingIndex = this.profilesIndex.findIndex((p) => p.userId === profile.userId);
    if (existingIndex >= 0) {
      this.profilesIndex[existingIndex] = profile;
    } else {
      this.profilesIndex.push(profile);
    }
  }

  private initializeMockData(): void {
    this.profilesIndex = [
      {
        userId: 'user-1',
        skills: ['react', 'typescript', 'node.js'],
        rating: 4.5,
        hourlyRate: 50,
        bio: 'Senior Full Stack Developer',
      },
      {
        userId: 'user-2',
        skills: ['python', 'aws', 'docker'],
        rating: 4.8,
        hourlyRate: 75,
        bio: 'DevOps Engineer',
      },
      {
        userId: 'user-3',
        skills: ['react', 'vue', 'javascript'],
        rating: 4.2,
        hourlyRate: 40,
        bio: 'Frontend Developer',
      },
    ];
  }
}

