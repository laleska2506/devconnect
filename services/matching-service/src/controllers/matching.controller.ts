import { Controller, Get, Query } from '@nestjs/common';
import { MatchingService } from '../services/matching.service';

interface SearchFilters {
  skills?: string[];
  minRating?: number;
}

@Controller('matches')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get()
  async searchMatches(
    @Query('skills') skills?: string,
    @Query('min_rating') minRating?: string
  ) {
    const filters: SearchFilters = {};
    if (skills) {
      filters.skills = skills.split(',').map((s) => s.trim());
    }
    if (minRating) {
      filters.minRating = parseFloat(minRating);
    }
    return this.matchingService.searchProfiles(filters);
  }
}

