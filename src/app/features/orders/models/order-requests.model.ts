import { PaymentStatus } from '../../payments/models/payment-enums';
import { OrderStatus } from './order-enums';

export interface CreateOrderDetailDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  deliveryAddressId: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  customerNotes?: string;
  orderDetails: CreateOrderDetailDto[];
}

export interface ConfirmOrderDto {
  notes?: string;
  requiredTime?: string;
}

export interface CancelOrderDto {
  CancellationReason: string;
}

export interface AssignDeliveryDto {
  deliveryPersonId?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryPersonId: string;
  notes: string;
}
