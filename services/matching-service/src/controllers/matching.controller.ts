import { Controller, Get, Query } from '@nestjs/common';
import { MatchingService } from '../services/matching.service';

@Controller('matches')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get()
  async searchMatches(
    @Query('skills') skills?: string,
    @Query('min_rating') minRating?: string
  ) {
    const filters: any = {};
    if (skills) {
      filters.skills = skills.split(',').map((s) => s.trim());
    }
    if (minRating) {
      filters.minRating = parseFloat(minRating);
    }
    return this.matchingService.searchProfiles(filters);
  }
}

