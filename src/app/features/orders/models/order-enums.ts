export enum OrderStatus {
  New = 0,
  Confirmed = 1,
  Preparing = 2,
  Ready = 3,
  OutForDelivery = 4,
  Delivered = 5,
  Cancelled = 6,
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.New]: 'New',
  [OrderStatus.Confirmed]: 'Confirmed',
  [OrderStatus.Preparing]: 'Preparing',
  [OrderStatus.Ready]: 'Ready',
  [OrderStatus.OutForDelivery]: 'Out For Delivery',
  [OrderStatus.Delivered]: 'Delivered',
  [OrderStatus.Cancelled]: 'Cancelled',
};

export enum OrderSource {
  Website = 0,
  Phone = 1,
  ThirdParty = 2,
}
