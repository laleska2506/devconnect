import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

interface PayMilestoneDto {
  amount: number;
}

@Controller('contracts/:contractId/milestones')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':milestoneId/pay')
  async payMilestone(
    @Param('contractId') contractId: string,
    @Param('milestoneId') milestoneId: string,
    @Body() dto: PayMilestoneDto
  ) {
    const payment = await this.paymentService.processMilestonePayment(
      contractId,
      milestoneId,
      dto.amount
    );

    return {
      status: 'success',
      payment: {
        id: payment.id,
        contractId: payment.contractId,
        milestoneId: payment.milestoneId,
        amount: payment.amount,
        providerTxId: payment.providerTxId,
        createdAt: payment.createdAt,
      },
    };
  }

  @Get()
  async getContractPayments(@Param('contractId') contractId: string) {
    return this.paymentService.getPaymentsByContract(contractId);
  }
}

