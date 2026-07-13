import { PaymentMethod, PaymentStatus } from './payment-enums';

export interface PaymentDto {
  paymentId: number;
  orderId: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
}
