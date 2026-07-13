import { Component, OnInit } from '@angular/core';
import {
  FilterOption,
  TopPageComponent,
} from '../../../../shared/components/top-page/top-page.component';
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../../../Core/Auth/services/auth.service';
import { OrderAction } from '../../helpers/order-actions.helper';
import { OrderStatus } from '../../models/order-enums';
import { OrderDto } from '../../models/order.model';
import { getActionForRole } from '../../helpers/order-role-actions.helper';
import { extractErrorResponse } from '../../../../shared/helpers/error.helpers';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, OrderListComponent, TopPageComponent],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  orders: OrderDto[] = [];
  isLoading = false;
  selectedStatus: OrderStatus | null = null;

  allowedRoleActions: OrderAction[] = [];

  filterOptions: FilterOption[] = [
    { label: 'New', value: OrderStatus.New.toString() },
    { label: 'Confirmed', value: OrderStatus.Confirmed.toString() },
    { label: 'Preparing', value: OrderStatus.Preparing.toString() },
    { label: 'Ready', value: OrderStatus.Ready.toString() },
    { label: 'Out For Delivery', value: OrderStatus.OutForDelivery.toString() },
    { label: 'Delivered', value: OrderStatus.Delivered.toString() },
    { label: 'Cancelled', value: OrderStatus.Cancelled.toString() },
  ];

  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.allowedRoleActions = getActionForRole(this.authService.getRole());
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;

    const request$ =
      this.selectedStatus === null
        ? this.ordersService.getAll()
        : this.ordersService.getByStatus(this.selectedStatus);

    request$.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to load orders'),
          'Error',
        );
        this.isLoading = false;
      },
    });
  }

  onFilterChange(statusValue: string): void {
    this.selectedStatus = statusValue === '' ? null : Number(statusValue);
    this.loadOrders();
  }

  onConfirm(orderId: number): void {
    this.ordersService.confirm(orderId, {}).subscribe({
      next: () => {
        this.toastr.success('Order confirmed successfully', 'Success');
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to confirm order'),
          'Error',
        );
      },
    });
  }

  onMarkPreparing(orderId: number): void {
    this.ordersService.markAsPreparing(orderId).subscribe({
      next: () => {
        this.toastr.success('Order is now being prepared', 'Success');
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to update order'),
          'Error',
        );
      },
    });
  }
  onMarkPrepared(orderId: number): void {
    this.ordersService.markAsPrepared(orderId).subscribe({
      next: () => {
        this.toastr.success('Order is ready', 'Success');
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to update order'),
          'Error',
        );
      },
    });
  }

  async onCancelOrder(orderId: number): Promise<void> {
    const Swal = await import('sweetalert2');
    const result = await Swal.default.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this order?',
      icon: 'warning',
      input: 'text',
      inputLabel: 'Enter cancellation reason',
      inputPlaceholder: 'e.g. Customer requested cancellation',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      confirmButtonColor: '#d33',
      cancelButtonText: 'No, keep it',
      inputValidator: (value) =>
        value ? undefined : 'A cancellation reason is required',
    });

    if (result.isConfirmed) {
      const cancellationReason = result.value;
      this.ordersService
        .cancel(orderId, { CancellationReason: cancellationReason })
        .subscribe({
          next: () => {
            this.toastr.success('Order cancelled successfully', 'Success');
            this.loadOrders();
          },
          error: (err: HttpErrorResponse) => {
            this.toastr.error(
              extractErrorResponse(err, 'Failed to cancel order'),
              'Error',
            );
          },
        });
    }
  }

  onViewDetails(orderId: number): void {
    console.log(`View details for order ID: ${orderId}`);
    this.router.navigate(['/Dashboard/Orders', orderId]);
  }
}
