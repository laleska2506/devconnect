import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>
  ) {}

  async create(payment: Partial<Payment>): Promise<Payment> {
    const newPayment = this.repository.create(payment);
    return this.repository.save(newPayment);
  }

  async findByContractId(contractId: string): Promise<Payment[]> {
    return this.repository.find({ where: { contractId } });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.repository.findOne({ where: { id } });
  }
}

