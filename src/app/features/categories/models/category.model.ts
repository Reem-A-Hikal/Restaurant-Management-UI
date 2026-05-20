import { PaginatedResponse } from '../../../shared/models/pagination.model';
import { SimpleDish } from '../../dishes/models/dish';

export enum CategoryStatus {
  Active = 0,
  Inactive = 1,
  Archived = 2,
}

export const CategoryStatusLabels: Record<CategoryStatus, string> = {
  [CategoryStatus.Active]: 'Active',
  [CategoryStatus.Inactive]: 'Inactive',
  [CategoryStatus.Archived]: 'Archived',
};

export interface Category {
  categoryId: number;
  name: string;
  status: CategoryStatus;
  displayOrder: number;
  totalItems: number;
  products?: SimpleDish[];
}

export interface CategoryCreateDto {
  name: string;
  status: CategoryStatus;
  displayOrder: number;
}

export interface CategoryUpdateDto {
  categoryId?: number;
  name?: string;
  status?: CategoryStatus;
  displayOrder?: number;
}

export interface CategoryListApiResponse extends PaginatedResponse<Category> {}

export type CategoryIcon =
  | 'appetizers'
  | 'main-course'
  | 'beverages'
  | 'desserts'
  | 'salads'
  | 'breakfast'
  | 'default';
