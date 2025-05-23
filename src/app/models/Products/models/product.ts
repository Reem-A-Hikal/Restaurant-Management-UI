import { Category } from '../../Category/Category';

export interface Product {
  productId: number;
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
  category: Category;
}
