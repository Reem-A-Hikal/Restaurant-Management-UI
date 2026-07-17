import { Pagination } from '../../../shared/models/pagination.model';

export enum ProductStatus {
  Available = 0,
  Unavailable = 1,
  Archived = 2,
}

export const ProductStatusLabels: Record<ProductStatus, string> = {
  [ProductStatus.Available]: 'Available',
  [ProductStatus.Unavailable]: 'Unavailable',
  [ProductStatus.Archived]: 'Archived',
};

export interface DishWithId {
  productId: number;
  name: string;
  price: number;
  discountedPrice: number;
  description?: string;
  imageUrl?: string;
  preparationTime: number;
  calories?: number;
  status: ProductStatus;
  isPromoted: boolean;
  discountPercent: number;
  allowedDiscountPercent: number;
  categoryId: number;
}

export interface CreateDishRequest {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  preparationTime: number;
  calories?: number;
  isPromoted: boolean;
  discountPercent: number;
  allowedDiscountPercent: number;
  categoryId: number;
}

export interface UpdateDishRequest {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  preparationTime?: number;
  calories?: number;
  categoryId?: number;
  isPromoted?: boolean;
  discountPercent?: number;
  allowedDiscountPercent?: number;
  status?: ProductStatus;
}

export interface DishesListApiResponse extends Pagination {
  items: DishWithId[];
}

export interface SimpleDish {
  productId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}
