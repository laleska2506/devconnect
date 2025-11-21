import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

interface ProfileFilters {
  skills?: string[];
  role?: string;
  minRating?: number;
}

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    const profile = await this.profileService.getProfile(id);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @Request() req: AuthenticatedRequest
  ) {
    return this.profileService.updateProfile(id, req.user.userId, dto);
  }

  @Get()
  async searchProfiles(
    @Query('skills') skills?: string,
    @Query('role') role?: string,
    @Query('min_rating') minRating?: string
  ) {
    const filters: ProfileFilters = {};
    if (skills) {
      filters.skills = skills.split(',').map((s) => s.trim());
    }
    if (role) {
      filters.role = role;
    }
    if (minRating) {
      filters.minRating = parseFloat(minRating);
    }
    return this.profileService.searchProfiles(filters);
  }
}

