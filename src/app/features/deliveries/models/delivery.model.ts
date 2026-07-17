import { DeliveryStatus } from './delivery-enums';

export interface DeliveryDto {
  deliveryId: number;
  orderId: number;
  orderNumber: string;
  status: DeliveryStatus;
  statusDisplay: string;
  deliveryPersonId: string;
  deliveryPersonName: string;
  assignedAt: string;
  statusChangeTime: string;
  deliveryStartTime: string | null;
  deliveryEndTime: string | null;
  cancelledAt: string | null;
  notes: string | null;
  customerAddress: string;
}

export interface AvailableDeliveryPersonDto {
  id: string;
  fullName: string;
  vehicleNumber: string;
}
