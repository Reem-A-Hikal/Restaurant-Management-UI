import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../services/dashboard.service';
import {
  DashboardStats,
  RecentOrder,
  TopDish,
} from '../../models/dashboard-stats.model';
import { ChartCardComponent } from '../../../../shared/components/chart-card/chart-card.component';
import { OrderStatusLabels } from '../../../orders/models/order-enums';
import { extractErrorResponse } from '../../../../shared/helpers/error.helper';
import { TopDishesCardComponent } from '../../components/top-dishes-card/top-dishes-card.component';
import { RecentOrdersCardComponent } from '../../components/recent-orders-card/recent-orders-card.component';

interface KpiCard {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ChartCardComponent,
    TopDishesCardComponent,
    RecentOrdersCardComponent,
  ],
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css'],
})
export class AdminOverviewComponent implements OnInit {
  isLoading = true;
  stats: DashboardStats | null = null;
  today = new Date();
  kpis: KpiCard[] = [];

  statusLabels: string[] = [];
  trendLabels: string[] = [];
  trendValues: number[] = [];
  topDishLabels: string[] = [];
  topDishValues: number[] = [];
  topDishes: TopDish[] = [];
  recentOrders: RecentOrder[] = [];

  trendDatasets: any[] = [];
  statusDatasets: any[] = [];
  topDishDatasets: any[] = [];

  private readonly statusColors: Record<number, string> = {
    0: '#8a938c', // Pending
    1: '#3d7a8c', // Confirmed
    2: '#b8720a', // Preparing
    3: '#00897a', // Ready
    4: '#00a86b', // Out for Delivery
    5: '#00643f', // Delivered
    6: '#ba1a1a', // Cancelled/Rejected
  };

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.dashboardService.getStats(7).subscribe({
      next: (stats) => {
        console.log(stats);

        this.stats = stats;
        this.buildKpis(stats);

        this.statusLabels = stats.ordersByStatus.map(
          (s) => OrderStatusLabels[s.status as keyof typeof OrderStatusLabels],
        );
        this.trendLabels = stats.revenueTrend.map((p) =>
          new Date(p.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        );
        this.trendValues = stats.revenueTrend.map((p) => p.revenue);
        this.topDishLabels = stats.topDishes.map((d) => d.name);
        this.topDishValues = stats.topDishes.map((d) => d.quantitySold);
        this.topDishes = stats.topDishes;
        this.recentOrders = stats.recentOrders;

        this.trendDatasets = [
          {
            label: 'Revenue',
            data: this.trendValues,
            borderColor: '#00643f',
            backgroundColor: 'rgba(0, 100, 63, 0.12)',
            fill: true,
            tension: 0.35,
          },
        ];

        this.statusDatasets = [
          {
            data: stats.ordersByStatus.map((s) => s.count),
            backgroundColor: stats.ordersByStatus.map(
              (s) => this.statusColors[s.status] ?? '#9eaaa0',
            ),
            borderWidth: 0,
          },
        ];

        this.topDishDatasets = [
          {
            label: 'Units Sold',
            data: this.topDishValues,
            backgroundColor: '#00a86b',
            borderRadius: 6,
          },
        ];

        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to load dashboard stats'),
          'Error',
        );
        this.isLoading = false;
      },
    });
  }

  private buildKpis(stats: DashboardStats): void {
    this.kpis = [
      {
        label: "Today's Orders",
        value: stats.totalOrdersToday.toString(),
        icon: 'receipt_long',
      },
      {
        label: 'Daily Revenue',
        value: `$${stats.dailyRevenue.toFixed(2)}`,
        icon: 'payments',
      },
      {
        label: 'Pending Orders',
        value: stats.pendingOrdersCount.toString(),
        icon: 'pending_actions',
      },
      {
        label: 'Active Deliveries',
        value: stats.activeDeliveriesCount.toString(),
        icon: 'local_shipping',
      },
    ];
  }
}
