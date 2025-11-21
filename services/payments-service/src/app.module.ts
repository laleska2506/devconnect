import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
})
export class AppModule {}

