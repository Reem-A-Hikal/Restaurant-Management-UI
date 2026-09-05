export interface AssignDeliveryDto {
  deliveryPersonId?: string;
}

export interface CancelDeliveryDto {
  reason: string;
}

export interface UpdateLocationDto {
  latitude: number;
  longitude: number;
}
