import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { CreateProposalDto } from '../dto/create-proposal.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ProjectStatus } from '../entities/project.entity';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProject(@Body() dto: CreateProjectDto, @Request() req: any) {
    return this.projectService.createProject(req.user.userId, dto);
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    return this.projectService.getProject(id);
  }

  @Get()
  async listProjects(
    @Query('status') status?: ProjectStatus,
    @Query('budget_min') budgetMin?: string,
    @Query('budget_max') budgetMax?: string
  ) {
    const filters: any = {};
    if (status) {
      filters.status = status;
    }
    if (budgetMin) {
      filters.budgetMin = parseFloat(budgetMin);
    }
    if (budgetMax) {
      filters.budgetMax = parseFloat(budgetMax);
    }
    return this.projectService.listProjects(filters);
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  async applyToProject(
    @Param('id') projectId: string,
    @Body() dto: CreateProposalDto,
    @Request() req: any
  ) {
    return this.projectService.createProposal(projectId, req.user.userId, dto);
  }
}

