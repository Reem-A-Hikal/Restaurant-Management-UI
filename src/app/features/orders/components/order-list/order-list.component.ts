import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderCardComponent } from '../order-card/order-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { OrderDto } from '../../models/order.model';
import { OrderAction } from '../../helpers/order-actions.helper';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, OrderCardComponent, EmptyStateComponent],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent {
  @Input() orders: OrderDto[] = [];
  @Input() isLoading = false;
  @Input() allowedRoleActions: OrderAction[] = [];

  @Output() confirm = new EventEmitter<number>();
  @Output() markPreparing = new EventEmitter<number>();
  @Output() markPrepared = new EventEmitter<number>();
  @Output() cancelOrder = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<number>();

  trackByOrderId(index: number, order: OrderDto): number {
    return order.orderId;
  }
}
