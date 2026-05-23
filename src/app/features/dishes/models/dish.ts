import { Pagination } from '../../../shared/models/pagination.model';

export interface Dish {
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
export interface DishWithId extends Dish {
  productId: number;
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
