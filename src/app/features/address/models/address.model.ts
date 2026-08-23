export enum AddressType {
  Home = 0,
  Work = 1,
  Other = 2,
}

export const AddressTypeLabels: Record<AddressType, string> = {
  [AddressType.Home]: 'Home',
  [AddressType.Work]: 'Work',
  [AddressType.Other]: 'Other',
};

export interface Address {
  addressId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  governorate?: string;
  latitude?: number;
  longitude?: number;
  addressType: AddressType;
  isDefault: boolean;
  userId: string;
}

export interface AddressCreateDto {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  governorate?: string;
  latitude?: number;
  longitude?: number;
  addressType: AddressType;
  isDefault?: boolean;
}

export interface AddressUpdateDto {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  governorate?: string;
  latitude?: number;
  longitude?: number;
  addressType?: AddressType;
  isDefault?: boolean;
}