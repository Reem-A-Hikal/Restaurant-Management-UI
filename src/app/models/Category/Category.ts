import { Product } from '../Products/models/product';

export interface Category {
  categoryId: number;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  products: Product[];
}
