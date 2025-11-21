import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { ProposalRepository } from '../repositories/proposal.repository';
import { CreateProjectDto } from '../dto/create-project.dto';
import { CreateProposalDto } from '../dto/create-proposal.dto';
import { Project, ProjectStatus } from '../entities/project.entity';
import { Proposal } from '../entities/proposal.entity';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly proposalRepository: ProposalRepository
  ) {}

  async createProject(clientId: string, dto: CreateProjectDto): Promise<Project> {
    return this.projectRepository.create({
      clientId,
      ...dto,
      status: ProjectStatus.OPEN,
    });
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async listProjects(filters: {
    status?: ProjectStatus;
    budgetMin?: number;
    budgetMax?: number;
  }): Promise<Project[]> {
    return this.projectRepository.findAll(filters);
  }

  async createProposal(
    projectId: string,
    freelancerId: string,
    dto: CreateProposalDto
  ): Promise<Proposal> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.proposalRepository.create({
      projectId,
      freelancerId,
      ...dto,
    });
  }
}

