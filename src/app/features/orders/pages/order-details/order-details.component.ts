import { Component, OnInit } from '@angular/core';
import { OrderDto } from '../../models/order.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../../../Core/Auth/services/auth.service';
import { extractErrorResponse } from '../../../../shared/helpers/error.helper';
import {
  getVisibleActions,
  OrderAction,
} from '../../helpers/order-actions.helper';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OrderStatusBadgeComponent } from '../../components/order-status-badge/order-status-badge.component';
import { DeliveryDto } from '../../../deliveries/models/delivery.model';
import { DeliveriesService } from '../../../deliveries/services/deliveries.service';
import { PaymentDto } from '../../../payments/models/payment.model';
import { PaymentsService } from '../../../payments/services/payments.service';
import {
  canViewDeliveryLogistics,
  canViewPayments,
} from '../../helpers/order-permissions.helper';
import { Observable } from 'rxjs';
import { OrderSummaryPanelComponent } from '../../components/order-summary-panel/order-summary-panel.component';
import { OrderLogisticsPanelComponent } from '../../components/order-logistics-panel/order-logistics-panel.component';
import { OrderCustomerPanelComponent } from '../../components/order-customer-panel/order-customer-panel.component';
import { OrderPaymentPanelComponent } from '../../components/order-payment-panel/order-payment-panel.component';
import { OrderActionsPanelComponent } from '../../components/order-actions-panel/order-actions-panel.component';

@Component({
  selector: 'app-order-details',
  imports: [
    CommonModule,
    OrderStatusBadgeComponent,
    OrderSummaryPanelComponent,
    OrderLogisticsPanelComponent,
    OrderCustomerPanelComponent,
    OrderPaymentPanelComponent,
    OrderActionsPanelComponent,
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  order: OrderDto | null = null;
  isLoading = false;
  isProcessingAction = false;

  delivery: DeliveryDto | null = null;
  isLoadingDelivery = false;
  deliveriesHistory: DeliveryDto[] = [];
  isLoadingHistory = false;

  payments: PaymentDto[] = [];
  isLoadingPayments = false;
  isRefunding = false;

  canSeeDeliveryLogistics = false;
  canSeePayments = false;

  orderId!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ordersService: OrdersService,
    private readonly deliveriesService: DeliveriesService,
    private readonly paymentsService: PaymentsService,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.goBack();
      return;
    }
    this.orderId = Number(idParam);

    this.setupPermissions();
    this.loadOrder();
    this.loadPermittedData();
  }

  private setupPermissions(): void {
    const role = this.authService.getRole();
    this.canSeeDeliveryLogistics = canViewDeliveryLogistics(role);
    this.canSeePayments = canViewPayments(role);
  }

  private loadPermittedData(): void {
    if (this.canSeeDeliveryLogistics) {
      this.loadDelivery();
      this.loadDeliveryHistory();
    }
    if (this.canSeePayments) {
      this.loadPayments();
    }
  }

  get visibleActions(): OrderAction[] {
    if (!this.order) return [];
    return getVisibleActions(this.order.status, this.authService.getRole());
  }

  loadOrder(): void {
    this.isLoading = true;
    this.ordersService.getById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to load order'),
          'Error',
        );
        this.isLoading = false;
        this.goBack();
      },
    });
  }

  private runOrderAction(
    action$: Observable<OrderDto>,
    successMessage: string,
  ): void {
    this.isProcessingAction = true;
    action$.subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.toastr.success(successMessage, 'Success');
        this.isProcessingAction = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(extractErrorResponse(err, 'Action failed'), 'Error');
        this.isProcessingAction = false;
      },
    });
  }

  onConfirm(): void {
    this.runOrderAction(
      this.ordersService.confirm(this.orderId, {}),
      'Order confirmed',
    );
  }

  onMarkPreparing(): void {
    this.runOrderAction(
      this.ordersService.markAsPreparing(this.orderId),
      'Order is now being prepared',
    );
  }

  onMarkPrepared(): void {
    this.runOrderAction(
      this.ordersService.markAsPrepared(this.orderId),
      'Order is ready',
    );
  }

  async onCancel(): Promise<void> {
    const Swal = await import('sweetalert2');
    const result = await Swal.default.fire({
      title: 'Cancel this order?',
      input: 'text',
      inputLabel: 'Cancellation reason',
      inputPlaceholder: 'e.g. Customer requested cancellation',
      showCancelButton: true,
      confirmButtonText: 'Cancel Order',
      confirmButtonColor: '#d33',
      inputValidator: (value) =>
        value ? undefined : 'A cancellation reason is required',
    });

    if (result.isConfirmed) {
      this.isProcessingAction = true;
      this.ordersService
        .cancel(this.orderId, { CancellationReason: result.value })
        .subscribe({
          next: (updatedOrder) => {
            this.order = updatedOrder;
            this.toastr.success('Order cancelled', 'Success');
            this.isProcessingAction = false;
          },
          error: (err: HttpErrorResponse) => {
            this.toastr.error(
              extractErrorResponse(err, 'Action failed'),
              'Error',
            );
            this.isProcessingAction = false;
          },
        });
    }
  }

  loadDelivery(): void {
    this.isLoadingDelivery = true;
    this.deliveriesService.getActiveForOrder(this.orderId).subscribe({
      next: (delivery) => {
        this.delivery = delivery;
        this.isLoadingDelivery = false;
      },
      error: () => {
        // Not having an active delivery yet isn't a user-facing error
        this.delivery = null;
        this.isLoadingDelivery = false;
      },
    });
  }

  onDeliveryAssigned(delivery: DeliveryDto): void {
    this.delivery = delivery;
    this.loadDeliveryHistory();
    this.loadDelivery();
  }

  loadDeliveryHistory(): void {
    this.isLoadingHistory = true;
    this.deliveriesService.getHistoryForOrder(this.orderId).subscribe({
      next: (history) => {
        this.deliveriesHistory = history;
        this.isLoadingHistory = false;
      },
      error: () => {
        this.deliveriesHistory = [];
        this.isLoadingHistory = false;
      },
    });
  }

  loadPayments(): void {
    this.isLoadingPayments = true;
    this.paymentsService.getHistory(this.orderId).subscribe({
      next: (payments) => {
        this.payments = payments;
        this.isLoadingPayments = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to load payment history'),
          'Error',
        );
        this.isLoadingPayments = false;
      },
    });
  }

  async onRefund(): Promise<void> {
    const Swal = await import('sweetalert2');
    const result = await Swal.default.fire({
      title: 'Refund this payment?',
      text: 'This will mark the completed payment as refunded.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, refund it',
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      this.isRefunding = true;
      this.paymentsService.refund(this.orderId).subscribe({
        next: () => {
          this.toastr.success('Payment refunded successfully', 'Success');
          this.isRefunding = false;
          this.loadPayments();
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(
            extractErrorResponse(err, 'Failed to refund payment'),
            'Error',
          );
          this.isRefunding = false;
        },
      });
    }
  }

  onPrintReceipt(): void {
    globalThis.print();
  }

  onTrackDelivery(): void {
    document
      .querySelector('.logistics-panel')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onViewOrderHistory(): void {
    if (this.order?.customerId) {
      this.router.navigate(['/Dashboard/Orders'], {
        queryParams: { customerId: this.order.customerId },
      });
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/Dashboard/Orders');
  }
}
