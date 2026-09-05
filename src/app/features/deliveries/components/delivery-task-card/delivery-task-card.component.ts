import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeliveryDto } from '../../models/delivery.model';
import { DeliveryStatus } from '../../models/delivery-enums';

@Component({
  selector: 'app-delivery-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-task-card.component.html',
  styleUrls: ['./delivery-task-card.component.css'],
})
export class DeliveryTaskCardComponent {
  @Input({ required: true }) delivery!: DeliveryDto;
  @Input() isProcessing = false;

  @Output() markPickedUp = new EventEmitter<number>();
  @Output() markDelivered = new EventEmitter<number>();
  @Output() cancelDelivery = new EventEmitter<number>();

  readonly DeliveryStatus = DeliveryStatus;

  /** 0 = Assigned, 1 = Picked up, 2 = Delivered — drives the route rail fill */
  get railStep(): number {
    switch (this.delivery.status) {
      case DeliveryStatus.PickedUp:
        return 1;
      case DeliveryStatus.Delivered:
        return 2;
      default:
        return 0;
    }
  }

  get primaryActionLabel(): string {
    return this.delivery.status === DeliveryStatus.Assigned
      ? 'Mark picked up'
      : 'Mark delivered';
  }

  onPrimaryAction(): void {
    if (this.delivery.status === DeliveryStatus.Assigned) {
      this.markPickedUp.emit(this.delivery.deliveryId);
    } else {
      this.markDelivered.emit(this.delivery.deliveryId);
    }
  }

  onCancelDelivery(): void {
    this.cancelDelivery.emit(this.delivery.deliveryId);
  }

  callCustomer(): void {
    if (this.delivery.customerPhone) {
      globalThis.location.href = `tel:${this.delivery.customerPhone}`;
    }
  }
}
