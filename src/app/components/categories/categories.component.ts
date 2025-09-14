import { Component, OnInit } from '@angular/core';
import { CatService } from '../../services/Cat.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../models/Category';
import { CommonModule } from '@angular/common';
import { TopPageComponent } from '../shared/TopPage/TopPage.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, TopPageComponent],
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
  trackCategory(index: number, category: any): any {
    return category && category.id ? category.id : index;
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

  addCategory(): void {}

  editCategory(cat: Category): void {}

  deleteCategory(cat: Category): void {}

  searchCategories(term: string): void {
    if (!term) {
      this.loadCategories();
      return;
    }
  }

  resetCategories(): void {
    this.loadCategories();
  }

  filterCategories(filter: string): void {
    if (!filter) {
      this.loadCategories();
      return;
    }
  }
}
