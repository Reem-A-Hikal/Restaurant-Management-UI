import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/Product.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class dishesComponent implements OnInit {
  products!: Product[];
  isLoading: boolean = true;

  constructor(
    private prodService: ProductService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.loadProducts();
  }
  loadProducts(): void {
    this.prodService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.toastr.error('Failed to load users', 'Error');
        this.isLoading = false;
      },
    });
  }
}
