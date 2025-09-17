import { Pagination } from './Pagination';

export interface Category {
  name: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
}
export interface CategoryWithId extends Category {
  categoryId: number;
}

export interface CategoryListApiResponse extends Pagination {
  items: Category[];
}
