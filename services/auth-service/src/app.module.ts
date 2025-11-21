import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AppModule {}

