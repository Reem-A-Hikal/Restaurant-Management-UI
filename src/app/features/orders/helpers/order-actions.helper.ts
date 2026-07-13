import { OrderStatus } from '../models/order-enums';

export type OrderAction = 'confirm' | 'preparing' | 'prepared' | 'cancel';

const AvailableActions: Record<OrderStatus, OrderAction[]> = {
  [OrderStatus.New]: ['confirm', 'cancel'],
  [OrderStatus.Confirmed]: ['preparing', 'cancel'],
  [OrderStatus.Preparing]: ['prepared', 'cancel'],
  [OrderStatus.Ready]: ['cancel'],
  [OrderStatus.OutForDelivery]: [],
  [OrderStatus.Delivered]: [],
  [OrderStatus.Cancelled]: [],
};

export function getAvailableActions(status: OrderStatus): OrderAction[] {
  return AvailableActions[status] ?? [];
}
