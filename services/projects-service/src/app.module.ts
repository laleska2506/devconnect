import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { ProjectRepository } from './repositories/project.repository';
import { ProposalRepository } from './repositories/proposal.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, ProposalRepository],
})
export class AppModule {}

