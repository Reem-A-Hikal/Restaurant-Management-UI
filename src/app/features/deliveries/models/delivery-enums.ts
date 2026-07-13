export enum DeliveryStatus {
  Assigned = 0,
  PickedUp = 1,
  Delivered = 2,
  Cancelled = 3,
}

export const DeliveryStatusLabels: Record<DeliveryStatus, string> = {
  [DeliveryStatus.Assigned]: 'Assigned',
  [DeliveryStatus.PickedUp]: 'Picked Up',
  [DeliveryStatus.Delivered]: 'Delivered',
  [DeliveryStatus.Cancelled]: 'Cancelled',
};