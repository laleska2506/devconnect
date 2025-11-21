import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../repositories/project.repository';
import { ProposalRepository } from '../repositories/proposal.repository';
import { ProjectStatus } from '../entities/project.entity';
import { NotFoundException } from '@nestjs/common';

jest.mock('../repositories/project.repository');
jest.mock('../repositories/proposal.repository');

describe('ProjectService', () => {
  let service: ProjectService;
  let projectRepository: jest.Mocked<ProjectRepository>;
  let proposalRepository: jest.Mocked<ProposalRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: ProjectRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: ProposalRepository,
          useValue: {
            create: jest.fn(),
            findByProjectId: jest.fn(),
            findByFreelancerId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    projectRepository = module.get(ProjectRepository);
    proposalRepository = module.get(ProposalRepository);
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const createDto = {
        title: 'Test Project',
        description: 'Test Description',
        budgetMin: 1000,
        budgetMax: 5000,
      };

      const mockProject = {
        id: 'project-id',
        clientId: 'client-id',
        ...createDto,
        status: ProjectStatus.OPEN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      projectRepository.create.mockResolvedValue(mockProject as any);

      const result = await service.createProject('client-id', createDto);

      expect(result).toEqual(mockProject);
      expect(projectRepository.create).toHaveBeenCalledWith({
        clientId: 'client-id',
        ...createDto,
        status: ProjectStatus.OPEN,
      });
    });
  });

  describe('getProject', () => {
    it('should return a project by id', async () => {
      const mockProject = {
        id: 'project-id',
        title: 'Test Project',
      };

      projectRepository.findById.mockResolvedValue(mockProject as any);

      const result = await service.getProject('project-id');

      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException if project not found', async () => {
      projectRepository.findById.mockResolvedValue(null);

      await expect(service.getProject('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});

