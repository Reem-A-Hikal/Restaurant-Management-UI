import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DeliveriesService } from '../../services/deliveries.service';
import {
  AvailableDeliveryPersonDto,
  DeliveryDto,
} from '../../models/delivery.model';
import { extractErrorResponse } from '../../../../shared/helpers/error.helper';

@Component({
  selector: 'app-assign-delivery-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-delivery-panel.component.html',
  styleUrls: ['./assign-delivery-panel.component.css'],
})
export class AssignDeliveryPanelComponent implements OnInit {
  @Input({ required: true }) orderId!: number;
  @Output() assigned = new EventEmitter<DeliveryDto>();

  availablePersons: AvailableDeliveryPersonDto[] = [];
  selectedPersonId: string = '';
  isLoadingPersons = false;
  isAssigning = false;

  constructor(
    private readonly deliveriesService: DeliveriesService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadAvailablePersons();
  }

  loadAvailablePersons(): void {
    this.isLoadingPersons = true;
    this.deliveriesService.getAvailablePersons().subscribe({
      next: (persons) => {
        this.availablePersons = persons;
        this.isLoadingPersons = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(
            err,
            'Failed to load available delivery persons',
          ),
          'Error',
        );
        this.isLoadingPersons = false;
      },
    });
  }

  onAssign(): void {
    this.isAssigning = true;
    const dto = this.selectedPersonId
      ? { deliveryPersonId: this.selectedPersonId }
      : {};

    this.deliveriesService.assign(this.orderId, dto).subscribe({
      next: (delivery) => {
        this.toastr.success('Delivery assigned successfully', 'Success');
        this.isAssigning = false;
        this.assigned.emit(delivery);
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to assign delivery'),
          'Error',
        );
        this.isAssigning = false;
      },
    });
  }
}
