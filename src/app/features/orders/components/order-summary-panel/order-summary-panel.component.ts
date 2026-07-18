import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderDto } from '../../models/order.model';

@Component({
  selector: 'app-order-summary-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary-panel.component.html',
  styleUrls: ['./order-summary-panel.component.css'],
})
export class OrderSummaryPanelComponent {
  @Input({ required: true }) order!: OrderDto;
}