import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { ProfileRepository } from './repositories/profile.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
})
export class AppModule {}

