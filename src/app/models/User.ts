import { Address } from './Address';
import { Pagination } from './Pagination';

export interface User {
  id: string;
  email: string;
  fullName: string;
  joinDate: Date;
  username: string;
  profileImageUrl: string;
  isActive: boolean;
  roles: string[];
  phoneNumber: string;
  specialization?: string;
  vehicleNumber?: string;
  isAvailable?: boolean;
  addresses?: Address[];
  orders?: any[]; // Replace 'any' with the actual Order type if available
}

export interface UserProfile {
  id: string;
  email: string;
  roles: string[];
}

export interface UserListApiResponse extends Pagination {
  items: User[];
}

export enum UserRole {
  Admin = 'Admin',
  Chef = 'Chef',
  DeliveryPerson = 'DeliveryPerson'
}
