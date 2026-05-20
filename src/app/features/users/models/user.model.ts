import { Address } from "../../../models/Address";

export interface User {
  id: string;
  email: string;
  fullName: string;
  joinDate: Date;
  username: string;
  profileImageUrl: string;
  isActive: boolean;
  role: string;
  phoneNumber: string;
  specialization?: string;
  vehicleNumber?: string;
  isAvailable?: boolean;
  addresses?: Address[];
  orders?: any[]; // Replace 'any' with the actual Order type if available
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
  isActive?: boolean;
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
