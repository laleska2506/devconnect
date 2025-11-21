import { Repository } from 'typeorm';
import { Proposal } from '../entities/proposal.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProposalRepository {
  constructor(
    @InjectRepository(Proposal)
    private readonly repository: Repository<Proposal>
  ) {}

  async create(proposal: Partial<Proposal>): Promise<Proposal> {
    const newProposal = this.repository.create(proposal);
    return this.repository.save(newProposal);
  }

  async findByProjectId(projectId: string): Promise<Proposal[]> {
    return this.repository.find({ where: { projectId } });
  }

  async findByFreelancerId(freelancerId: string): Promise<Proposal[]> {
    return this.repository.find({ where: { freelancerId } });
  }
}

