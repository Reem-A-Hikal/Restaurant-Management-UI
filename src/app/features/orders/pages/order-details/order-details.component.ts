import { Component, OnInit } from '@angular/core';
import { OrderDto } from '../../models/order.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../../../Core/Auth/services/auth.service';
import { extractErrorResponse } from '../../../../shared/helpers/error.helper';
import {
  getAvailableActions,
  OrderAction,
} from '../../helpers/order-actions.helper';
import { getActionForRole } from '../../helpers/order-role-actions.helper';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OrderStatusBadgeComponent } from '../../components/order-status-badge/order-status-badge.component';
import { DeliveryDto } from '../../../deliveries/models/delivery.model';
import { DeliveriesService } from '../../../deliveries/services/deliveries.service';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { AssignDeliveryPanelComponent } from '../../../deliveries/components/assign-delivery-panel/assign-delivery-panel.component';
import { OrderStatus } from '../../models/order-enums';
import { PaymentDto } from '../../../payments/models/payment.model';
import {
  PaymentMethodLabels,
  PaymentStatus,
  PaymentStatusLabels,
} from '../../../payments/models/payment-enums';
import { PaymentsService } from '../../../payments/services/payments.service';

@Component({
  selector: 'app-order-details',
  imports: [
    CommonModule,
    OrderStatusBadgeComponent,
    MdbTooltipModule,
    AssignDeliveryPanelComponent,
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

  orderId!: number;

  readonly OrderStatus = OrderStatus;
  readonly PaymentStatus = PaymentStatus;
  readonly PaymentMethodLabels = PaymentMethodLabels;
  readonly PaymentStatusLabels = PaymentStatusLabels;

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

  get timelineSteps(): {
    label: string;
    sub?: string;
    time?: string;
    done: boolean;
    icon: string;
  }[] {
    const all = [...this.deliveriesHistory];
    if (
      this.delivery &&
      !all.some((d) => d.deliveryId === this.delivery!.deliveryId)
    ) {
      all.unshift(this.delivery);
    }

    // ترتيب المحاولات حسب الـ ID (تصاعدي) لتحديد رقم المحاولة
    const sortedByCreation = [...all].sort(
      (a, b) => a.deliveryId - b.deliveryId,
    );
    const showAttemptLabel = sortedByCreation.length > 1;

    const isValidDate = (value: string | null | undefined): value is string =>
      !!value && new Date(value).getFullYear() > 1970;

    // تجميع كل الخطوات مع بيانات إضافية للترتيب
    const steps: {
      label: string;
      sub?: string;
      time: string;
      done: boolean;
      icon: string;
      priority: number; // 3=Delivered, 2=PickedUp, 1=Assigned, 0=Cancelled
      attemptNumber: number; // رقم المحاولة (1-based)
    }[] = [];

    sortedByCreation.forEach((d, index) => {
      const attemptNumber = index + 1;
      const attemptPrefix = showAttemptLabel
        ? `Attempt ${attemptNumber} · `
        : '';
      const courier = d.deliveryPersonName
        ? `${attemptPrefix}Courier: ${d.deliveryPersonName}`
        : attemptPrefix || undefined;

      // 1. Courier Assigned (priority = 1)
      if (isValidDate(d.assignedAt)) {
        steps.push({
          label: 'Courier Assigned',
          sub: courier,
          time: d.assignedAt,
          done: true,
          icon: 'fa-truck',
          priority: 1,
          attemptNumber,
        });
      }

      // 2. Picked Up (priority = 2)
      if (isValidDate(d.deliveryStartTime)) {
        steps.push({
          label: 'Picked Up by Courier',
          sub: courier,
          time: d.deliveryStartTime,
          done: true,
          icon: 'fa-box',
          priority: 2,
          attemptNumber,
        });
      }

      // 3. Delivered (priority = 3)
      if (isValidDate(d.deliveryEndTime)) {
        steps.push({
          label: 'Delivered Successfully',
          sub: courier,
          time: d.deliveryEndTime,
          done: true,
          icon: 'fa-check',
          priority: 3,
          attemptNumber,
        });
      }

      // 4. Cancelled (priority = 0، ولكن سيظهر حسب وقته)
      if (isValidDate(d.cancelledAt)) {
        steps.push({
          label: 'Delivery Cancelled',
          sub: d.notes ?? courier,
          time: d.cancelledAt,
          done: false,
          icon: 'fa-xmark',
          priority: 0,
          attemptNumber,
        });
      }
    });

    // الترتيب النهائي:
    // 1. تنازلي حسب الوقت (الأحدث أولاً)
    // 2. إذا تساوى الوقت، تنازلي حسب الأولوية (Delivered > PickedUp > Assigned)
    // 3. إذا تساوت الأولوية والوقت، تنازلي حسب رقم المحاولة
    return steps
      .filter((s) => s.time)
      .sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        if (timeA !== timeB) {
          return timeB - timeA; // تنازلي حسب الوقت
        }
        if (a.priority !== b.priority) {
          return b.priority - a.priority; // تنازلي حسب الأولوية
        }
        return b.attemptNumber - a.attemptNumber; // تنازلي حسب رقم المحاولة
      })
      .map((s) => ({
        ...s,
        time: new Date(s.time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
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
    this.loadOrder();
    this.loadDelivery();
    this.loadPayments();
    this.loadDeliveryHistory();
  }

  // ---- Order ----

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

  get visibleActions(): OrderAction[] {
    if (!this.order) return [];
    const statusActions = getAvailableActions(this.order.status);
    const roleActions = getActionForRole(this.authService.getRole());
    return statusActions.filter((a) => roleActions.includes(a));
  }

  onConfirm(): void {
    this.isProcessingAction = true;
    this.ordersService.confirm(this.orderId, {}).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.toastr.success('Order confirmed', 'Success');
        this.isProcessingAction = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(extractErrorResponse(err, 'Action failed'), 'Error');
        this.isProcessingAction = false;
      },
    });
  }

  onMarkPreparing(): void {
    this.isProcessingAction = true;
    this.ordersService.markAsPreparing(this.orderId).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.toastr.success('Order is now being prepared', 'Success');
        this.isProcessingAction = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(extractErrorResponse(err, 'Action failed'), 'Error');
        this.isProcessingAction = false;
      },
    });
  }

  onMarkPrepared(): void {
    this.isProcessingAction = true;
    this.ordersService.markAsPrepared(this.orderId).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.toastr.success('Order is ready', 'Success');
        this.isProcessingAction = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(extractErrorResponse(err, 'Action failed'), 'Error');
        this.isProcessingAction = false;
      },
    });
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

  // ---- Delivery ----

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

  // ---- Payment ----

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

  get hasCompletedPayment(): boolean {
    return this.payments.some((p) => p.status === PaymentStatus.Completed);
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

  // ---- Navigation ----

  goBack(): void {
    this.router.navigateByUrl('/Dashboard/Orders');
  }
}
