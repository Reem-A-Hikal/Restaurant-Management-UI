import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { DeliveryDto } from '../../../deliveries/models/delivery.model';
import { DeliveriesService } from '../../../deliveries/services/deliveries.service';
import { CourierActivityService } from '../../../deliveries/services/courier-activity.service';
import { DeliveryTaskCardComponent } from '../../../deliveries/components/delivery-task-card/delivery-task-card.component';
import { extractErrorResponse } from '../../../../shared/helpers/error.helper';

@Component({
  selector: 'app-my-deliveries',
  standalone: true,
  imports: [CommonModule, DeliveryTaskCardComponent],
  templateUrl: './my-deliveries.component.html',
  styleUrls: ['./my-deliveries.component.css'],
})
export class MyDeliveriesComponent implements OnInit {
  deliveries: DeliveryDto[] = [];
  isLoading = false;
  processingId: number | null = null;

  constructor(
    private readonly deliveriesService: DeliveriesService,
    private readonly courierActivity: CourierActivityService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadDeliveries();
  }

  get isEmpty(): boolean {
    return !this.isLoading && this.deliveries.length === 0;
  }

  loadDeliveries(): void {
    this.isLoading = true;
    this.deliveriesService.getMyDeliveries().subscribe({
      next: (deliveries) => {
        this.deliveries = deliveries;
        this.courierActivity.setCount(deliveries.length);
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to load your deliveries'),
          'Error',
        );
        this.isLoading = false;
      },
    });
  }

  trackByDeliveryId(index: number, delivery: DeliveryDto): number {
    return delivery.deliveryId;
  }

  onMarkPickedUp(deliveryId: number): void {
    this.processingId = deliveryId;
    this.deliveriesService
      .markPickedUp(deliveryId)
      .pipe(finalize(() => (this.processingId = null)))
      .subscribe({
        next: () => {
          this.toastr.success('Marked as picked up', 'Success');
          this.loadDeliveries();
        },
        error: (err) => {
          this.toastr.error(
            extractErrorResponse(err, 'Failed to update delivery'),
            'Error',
          );
        },
      });
  }

  onMarkDelivered(deliveryId: number): void {
    this.processingId = deliveryId;
    this.deliveriesService
      .markDelivered(deliveryId)
      .pipe(finalize(() => (this.processingId = null)))
      .subscribe({
        next: () => {
          this.toastr.success('Order marked as delivered', 'Success');
          this.loadDeliveries();
        },
        error: (err) => {
          this.toastr.error(
            extractErrorResponse(err, 'Failed to update delivery'),
            'Error',
          );
        },
      });
  }

  async onCancelDelivery(deliveryId: number): Promise<void> {
    const Swal = await import('sweetalert2');
    const result = await Swal.default.fire({
      title: 'Cancel this delivery?',
      input: 'text',
      inputLabel: 'Reason',
      inputPlaceholder: 'e.g. Customer not reachable',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      confirmButtonColor: '#d33',
      inputValidator: (value) => (value ? undefined : 'A reason is required'),
    });

    if (!result.isConfirmed) return;

    this.processingId = deliveryId;
    this.deliveriesService
      .cancelDelivery(deliveryId, { reason: result.value })
      .pipe(finalize(() => (this.processingId = null)))
      .subscribe({
        next: () => {
          this.toastr.success('Delivery cancelled', 'Success');
          this.loadDeliveries();
        },
        error: (err) => {
          this.toastr.error(
            extractErrorResponse(err, 'Failed to cancel delivery'),
            'Error',
          );
        },
      });
  }
}