import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderDto } from '../../models/order.model';
import { OrderStatus } from '../../models/order-enums';
import { DeliveryDto } from '../../../deliveries/models/delivery.model';
import { AssignDeliveryPanelComponent } from '../../../deliveries/components/assign-delivery-panel/assign-delivery-panel.component';
import {
  buildDeliveryTimeline,
  TimelineStep,
} from '../../helpers/delivery-timeline.helper';

@Component({
  selector: 'app-order-logistics-panel',
  standalone: true,
  imports: [CommonModule, AssignDeliveryPanelComponent],
  templateUrl: './order-logistics-panel.component.html',
  styleUrls: ['./order-logistics-panel.component.css'],
})
export class OrderLogisticsPanelComponent {
  @Input({ required: true }) orderId!: number;
  @Input({ required: true }) order!: OrderDto;
  @Input() delivery: DeliveryDto | null = null;
  @Input() deliveriesHistory: DeliveryDto[] = [];
  @Input() isLoading = false;

  @Output() deliveryAssigned = new EventEmitter<DeliveryDto>();

  readonly OrderStatus = OrderStatus;

  get timelineSteps(): TimelineStep[] {
    return buildDeliveryTimeline(this.delivery, this.deliveriesHistory);
  }

  onDeliveryAssigned(delivery: DeliveryDto): void {
    this.deliveryAssigned.emit(delivery);
  }
}
