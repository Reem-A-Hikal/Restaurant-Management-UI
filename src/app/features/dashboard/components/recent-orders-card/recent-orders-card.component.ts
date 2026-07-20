import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RecentOrder, StatusStyle } from '../../models/dashboard-stats.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-orders-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './recent-orders-card.component.html',
  styleUrls: ['./recent-orders-card.component.css'],
})
export class RecentOrdersCardComponent {
  constructor(private readonly router: Router) {}
  @Input() title = '';
  @Input() subtitle = '';
  @Input() orders: RecentOrder[] = [];
  @Input() isLoading = false;

  /** Cap the number of rows rendered. Leave unset to show all. */
  @Input() maxItems?: number;

  // Mirrors the donut chart palette in admin-overview.component.ts by name
  // instead of numeric status, since this DTO only sends statusDisplay.
  // NOTE: verify these keys match your OrderStatus enum's ToString() output
  // exactly (e.g. "OutForDelivery" with no spaces) — adjust if any differ.
  private readonly statusStyles: Record<string, StatusStyle> = {
    Pending: { bg: '#6b72801a', color: '#6b7280' },
    New: { bg: '#6b72801a', color: '#6b7280' },
    Confirmed: { bg: '#2f66901a', color: '#2f6690' },
    Preparing: { bg: '#b8720a1a', color: '#b8720a' },
    Ready: { bg: '#0f9b8e1a', color: '#0f9b8e' },
    OutForDelivery: { bg: '#5b5bd61a', color: '#5b5bd6' },
    Delivered: { bg: '#00643f1a', color: '#00643f' },
    Cancelled: { bg: '#ba1a1a1a', color: '#ba1a1a' },
    Rejected: { bg: '#ba1a1a1a', color: '#ba1a1a' },
  };

  private readonly fallbackStyle: StatusStyle = {
    bg: '#6b72801a',
    color: '#6b7280',
  };

  get visibleOrders(): RecentOrder[] {
    return this.maxItems ? this.orders.slice(0, this.maxItems) : this.orders;
  }

  get skeletonRows(): number[] {
    return Array.from({ length: this.maxItems ?? 5 });
  }

  statusStyle(status: string): StatusStyle {
    return this.statusStyles[status] ?? this.fallbackStyle;
  }

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  viewAll() {
    this.router.navigate(['/Dashboard/Orders']);
  }

  formatStatus(status: string): string {
    return status.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
