import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../entities/project.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>
  ) {}

  async create(project: Partial<Project>): Promise<Project> {
    const newProject = this.repository.create(project);
    return this.repository.save(newProject);
  }

  async findById(id: string): Promise<Project | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(filters: {
    status?: ProjectStatus;
    budgetMin?: number;
    budgetMax?: number;
  }): Promise<Project[]> {
    const query = this.repository.createQueryBuilder('project');

    if (filters.status) {
      query.andWhere('project.status = :status', { status: filters.status });
    }

    if (filters.budgetMin !== undefined) {
      query.andWhere('project.budgetMax >= :budgetMin', { budgetMin: filters.budgetMin });
    }

    if (filters.budgetMax !== undefined) {
      query.andWhere('project.budgetMin <= :budgetMax', { budgetMax: filters.budgetMax });
    }

    return query.orderBy('project.createdAt', 'DESC').getMany();
  }
}

