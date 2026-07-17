import { Address } from '../../profile/models/address.model';

export enum UserStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Deleted = 3,
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  joinDate: Date;
  username: string;
  profileImageUrl: string;
  isActive: boolean;
  role: string;
  status: UserStatus;
  phoneNumber: string;
  specialization?: string;
  vehicleNumber?: string;
  isAvailable?: boolean;
  addresses?: Address[];
  orders?: any[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export enum UserRole {
  Admin = 'Admin',
  Chef = 'Chef',
  DeliveryPerson = 'DeliveryPerson',
  Customer = 'Customer',
}

export interface AdminUpdateRequest {
  status?: UserStatus;
  specialization?: string;
  vehicleNumber?: string;
  isAvailable?: boolean;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export interface CreateUserRequest {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userRole: string;
  specialization?: string;
  vehicleNumber?: string;
  isAvailable?: boolean;
  profileImageUrl?: string;
}
