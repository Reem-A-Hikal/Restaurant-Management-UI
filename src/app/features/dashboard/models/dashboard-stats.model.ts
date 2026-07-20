export interface OrderStatusCount {
  status: number;
  count: number;
  percentage: number;
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
}

export interface TopDish {
  productId: number;
  name: string;
  quantitySold: number;
  revenue: number;
  imageUrl?: string;
}

export interface RecentOrder {
  orderNumber: string;
  statusDisplay: string;
  customerName: string;
  totalAmount: number;
}

export interface StatusStyle {
  bg: string;
  color: string;
}

export interface DashboardStats {
  totalOrdersToday: number;
  dailyRevenue: number;
  pendingOrdersCount: number;
  activeDeliveriesCount: number;
  ordersByStatus: OrderStatusCount[];
  revenueTrend: RevenueTrendPoint[];
  topDishes: TopDish[];
  recentOrders: RecentOrder[];
}
