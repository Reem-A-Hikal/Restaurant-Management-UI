import { Component, OnInit } from '@angular/core';
import { CatService } from '../../services/Cat.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../models/Category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  constructor(private catService: CatService, private toastr: ToastrService) {}

  categories?: Category[];
  isLoading: boolean = false;

  ngOnInit() {
    this.loadCategories();
  }
  loadCategories(): void {
    this.catService.getAllCats().subscribe({
      next: (cats) => {
        this.categories = cats;
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
