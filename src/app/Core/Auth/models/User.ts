import { Pagination } from "../../../models/Pagination";

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
  addresses?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  roles: string[];
}

export interface UserListApiResponse extends Pagination {
  items: User[];
}
