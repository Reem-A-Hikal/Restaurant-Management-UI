import { Pagination } from './Pagination';

export interface Product {
  name: string;
  price: number;
  description: string;
  image: string;
  preparationTime: number;
  calories: number;
  isAvailable: boolean;
  isPromoted: boolean;
  discountPercent: number;
  allowedDiscountPercent: number;
  categoryId: number;
}
export interface ProductWithId extends Product {
  productId: number;
}
export interface ProductsListApiResponse extends Pagination {
  items: ProductWithId[];
}