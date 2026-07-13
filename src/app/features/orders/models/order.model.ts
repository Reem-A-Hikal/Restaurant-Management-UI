import { PaymentStatus } from '../../payments/models/payment-enums';
import { OrderStatus } from './order-enums';

export interface OrderDetailDto {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDto {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  statusDisplay: string;
  subTotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  isPaid: boolean;
  customerName: string | null;
  customerId: string | null;
  customerAddress: string | null;
  customerNotes: string | null;
  staffNotes: string | null;
  orderDetails: OrderDetailDto[];
}
