import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderDto } from '../../models/order.model';
import {
  getAvailableActions,
  OrderAction,
} from '../../helpers/order-actions.helper';
import { OrderStatusBadgeComponent } from '../order-status-badge/order-status-badge.component';

@Component({
  selector: 'app-order-card',
  imports: [CommonModule, OrderStatusBadgeComponent],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
})
export class OrderCardComponent {
  @Input({ required: true }) order!: OrderDto;
  @Input() allowedRoleActions: OrderAction[] = [
    'confirm',
    'preparing',
    'prepared',
    'cancel',
  ];

  @Output() confirm = new EventEmitter<number>();
  @Output() markPreparing = new EventEmitter<number>();
  @Output() markPrepared = new EventEmitter<number>();
  @Output() cancelOrder = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<number>();

  get visibleActions(): OrderAction[] {
    return getAvailableActions(this.order.status).filter((a) =>
      this.allowedRoleActions.includes(a),
    );
  }

  onConfirm(): void {
    this.confirm.emit(this.order.orderId);
  }

  onMarkPreparing(): void {
    this.markPreparing.emit(this.order.orderId);
  }

  onMarkPrepared(): void {
    this.markPrepared.emit(this.order.orderId);
  }

  onCancelOrder(): void {
    this.cancelOrder.emit(this.order.orderId);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.order.orderId);
  }
}
