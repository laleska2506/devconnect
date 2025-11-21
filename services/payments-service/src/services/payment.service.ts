import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { Payment, PaymentStatus } from '../entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async processMilestonePayment(
    contractId: string,
    milestoneId: string,
    amount: number
  ): Promise<Payment> {
    // TODO: Integrate real Stripe API here
    // For now, simulate a successful payment
    const mockProviderTxId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const payment = await this.paymentRepository.create({
      contractId,
      milestoneId,
      amount,
      status: PaymentStatus.SUCCESS,
      providerTxId: mockProviderTxId,
    });

    return payment;
  }

  async getPaymentsByContract(contractId: string): Promise<Payment[]> {
    return this.paymentRepository.findByContractId(contractId);
  }
}

