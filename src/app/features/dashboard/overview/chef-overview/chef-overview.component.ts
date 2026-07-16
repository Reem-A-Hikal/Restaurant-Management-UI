import { Component, OnInit } from '@angular/core';
import { OrderDto } from '../../../orders/models/order.model';
import { OrdersService } from '../../../orders/services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { extractErrorResponse } from '../../../../shared/helpers/error.helper';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chef-overview',
  imports: [CommonModule],
  templateUrl: './chef-overview.component.html',
  styleUrls: ['./chef-overview.component.css'],
})
export class ChefOverviewComponent implements OnInit {
  kitchenQueue: OrderDto[] = [];
  isLoading = false;

  constructor(
    private readonly ordersService: OrdersService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadKitchenQueue();
  }

  loadKitchenQueue(): void {
    this.isLoading = true;
    this.ordersService.getKitchenQueue().subscribe({
      next: (orders) => {
        this.kitchenQueue = orders;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to load kitchen queue'),
          'Error',
        );
        this.isLoading = false;
      },
    });
  }

  onViewOrder(orderId: number): void {
    this.router.navigate(['/Dashboard/Orders', orderId]);
  }
}
