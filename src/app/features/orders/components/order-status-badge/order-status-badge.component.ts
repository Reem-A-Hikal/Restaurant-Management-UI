import { Component, Input } from '@angular/core';
import { OrderStatus, OrderStatusLabels } from '../../models/order-enums';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status-badge',
  imports: [CommonModule],
  templateUrl: './order-status-badge.component.html',
  styleUrls: ['./order-status-badge.component.css'],
})
export class OrderStatusBadgeComponent {
  @Input({ required: true }) status!: OrderStatus;

  readonly OrderStatusLabels = OrderStatusLabels;

  get statusClass(): string {
    switch (this.status) {
      case OrderStatus.New:
        return 'status--new';
      case OrderStatus.Confirmed:
        return 'status--confirmed';
      case OrderStatus.Preparing:
        return 'status--preparing';
      case OrderStatus.Ready:
        return 'status--ready';
      case OrderStatus.OutForDelivery:
        return 'status--out-for-delivery';
      case OrderStatus.Delivered:
        return 'status--delivered';
      case OrderStatus.Cancelled:
        return 'status--cancelled';
      default:
        return '';
    }
  }
}
