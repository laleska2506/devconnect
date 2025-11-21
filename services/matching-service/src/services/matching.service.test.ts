import { Test, TestingModule } from '@nestjs/testing';
import { MatchingService } from './matching.service';

describe('MatchingService', () => {
  let service: MatchingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchingService],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchProfiles', () => {
    it('should return profiles filtered by skills', async () => {
      const results = await service.searchProfiles({ skills: ['react'] });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return profiles filtered by minimum rating', async () => {
      const results = await service.searchProfiles({ minRating: 4.5 });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return all profiles when no filters are provided', async () => {
      const results = await service.searchProfiles({});
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('indexProfile', () => {
    it('should index a new profile', async () => {
      const profile = {
        userId: 'test-user',
        skills: ['test'],
        rating: 5.0,
        hourlyRate: 100,
        bio: 'Test profile',
      };
      await service.indexProfile(profile);
      const results = await service.searchProfiles({ skills: ['test'] });
      expect(results.length).toBeGreaterThan(0);
    });
  });
});

