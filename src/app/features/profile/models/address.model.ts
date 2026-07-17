export interface Address {
  addressId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  latitude?: number;
  longitude?: number;
  addressType: string;
  isDefault: boolean;
}
