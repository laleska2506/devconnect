import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'devconnect',
      entities: [Payment],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: false,
    }),
    TypeOrmModule.forFeature([Payment]),
  ],
})
export class DatabaseModule {}

