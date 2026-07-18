import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentDto } from '../../../payments/models/payment.model';
import {
  PaymentMethodLabels,
  PaymentStatus,
  PaymentStatusLabels,
} from '../../../payments/models/payment-enums';

@Component({
  selector: 'app-order-payment-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-payment-panel.component.html',
  styleUrls: ['./order-payment-panel.component.css'],
})
export class OrderPaymentPanelComponent {
  @Input() payments: PaymentDto[] = [];
  @Input() isLoading = false;
  @Input() isRefunding = false;
  @Input() staffNotes: string | null = null;

  @Output() refund = new EventEmitter<void>();

  readonly PaymentStatus = PaymentStatus;
  readonly PaymentMethodLabels = PaymentMethodLabels;
  readonly PaymentStatusLabels = PaymentStatusLabels;

  get hasCompletedPayment(): boolean {
    return this.payments.some((p) => p.status === PaymentStatus.Completed);
  }
}
