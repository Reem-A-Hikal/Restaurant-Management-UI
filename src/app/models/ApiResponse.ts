import { Pagination } from "./Pagination";

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Pagination & { items: any[] } | any;
  errors?: string;
}