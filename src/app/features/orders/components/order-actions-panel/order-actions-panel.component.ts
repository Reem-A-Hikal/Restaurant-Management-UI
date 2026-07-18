import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderAction } from '../../helpers/order-actions.helper';

@Component({
  selector: 'app-order-actions-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-actions-panel.component.html',
  styleUrls: ['./order-actions-panel.component.css'],
})
export class OrderActionsPanelComponent {
  @Input({ required: true }) visibleActions!: OrderAction[];
  @Input() isProcessing = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() markPreparing = new EventEmitter<void>();
  @Output() markPrepared = new EventEmitter<void>();
  @Output() cancelOrder = new EventEmitter<void>();
}
