import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderDto } from '../../models/order.model';

@Component({
  selector: 'app-order-customer-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-customer-panel.component.html',
  styleUrls: ['./order-customer-panel.component.css'],
})
export class OrderCustomerPanelComponent {
  @Input({ required: true }) order!: OrderDto;
  @Output() viewHistory = new EventEmitter<void>();

  get customerInitials(): string {
    if (!this.order?.customerName) return '?';
    return this.order.customerName
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
