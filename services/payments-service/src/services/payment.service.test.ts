import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentStatus } from '../entities/payment.entity';

jest.mock('../repositories/payment.repository');

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: jest.Mocked<PaymentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PaymentRepository,
          useValue: {
            create: jest.fn(),
            findByContractId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get(PaymentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processMilestonePayment', () => {
    it('should process a milestone payment successfully', async () => {
      const mockPayment = {
        id: 'payment-id',
        contractId: 'contract-id',
        milestoneId: 'milestone-id',
        amount: 1000,
        status: PaymentStatus.SUCCESS,
        providerTxId: 'tx_123',
        createdAt: new Date(),
      };

      paymentRepository.create.mockResolvedValue(mockPayment as any);

      const result = await service.processMilestonePayment('contract-id', 'milestone-id', 1000);

      expect(result).toEqual(mockPayment);
      expect(result.status).toBe(PaymentStatus.SUCCESS);
      expect(result.providerTxId).toBeDefined();
      expect(paymentRepository.create).toHaveBeenCalled();
    });
  });

  describe('getPaymentsByContract', () => {
    it('should return payments for a contract', async () => {
      const mockPayments = [
        {
          id: 'payment-1',
          contractId: 'contract-id',
          milestoneId: 'milestone-1',
          amount: 500,
          status: PaymentStatus.SUCCESS,
          providerTxId: 'tx_123',
          createdAt: new Date(),
        },
      ];

      paymentRepository.findByContractId.mockResolvedValue(mockPayments as any);

      const result = await service.getPaymentsByContract('contract-id');

      expect(result).toEqual(mockPayments);
      expect(paymentRepository.findByContractId).toHaveBeenCalledWith('contract-id');
    });
  });
});

