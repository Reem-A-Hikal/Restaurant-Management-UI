import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CategoryService } from '../../../services/Category.service';
import { ToastrService } from 'ngx-toastr';
import { Category, CategoryWithId } from '../../../models/Category';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-addCategory',
  templateUrl: './manageCategory.component.html',
  imports: [CommonModule, ReactiveFormsModule, MdbModalModule],
  styleUrls: ['./manageCategory.component.css'],
})
export class ManageCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  isSubmitting: boolean = false;
  editMode: boolean = false;
  categoryToEdit?: CategoryWithId;
  title?: string;

  constructor(
    public modalRef: MdbModalRef<ManageCategoryComponent>,
    private fb: FormBuilder,
    private catServ: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.categoryToEdit) {
      this.editMode = true;
    }

    this.initForm();
  }

  private initForm() {
    this.categoryForm = this.fb.group({
      name: [
        this.categoryToEdit?.name || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: [
        this.categoryToEdit?.description || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      isActive: [this.categoryToEdit?.isActive ?? true],
      displayOrder: [
        this.categoryToEdit?.displayOrder ?? 1,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;

    this.isSubmitting = true;

    if (this.editMode && this.categoryToEdit) {
      const updatedCategory: CategoryWithId = {
        ...this.categoryToEdit,
        ...this.categoryForm.value,
      };
      this.saveCategory(
        this.catServ.updateCat(updatedCategory.categoryId, updatedCategory)
      );
    } else {
      const newCategory: Category = this.categoryForm.value;
      this.saveCategory(this.catServ.createCat(newCategory));
    }
  }

  private saveCategory(request$: Observable<any>) {
    request$.pipe(take(1)).subscribe({
      next: (res) => {
        this.toastr.success(res.message, 'Success');
        this.modalRef.close('success');
        this.isSubmitting = false;
      },
      error: () => {
        this.toastr.error('Failed to save category', 'Error');
        this.isSubmitting = false;
      },
    });
  }

  /* old code kept for reference
  // private updateCategory() {
  //   if (this.categoryForm.invalid || !this.categoryToEdit) return;

  //   this.isSubmitting = true;
  //   const updatedCategory: CategoryWithId = {
  //     ...this.categoryToEdit,
  //     ...this.categoryForm.value,
  //   };
  //   this.catServ
  //     .updateCat(updatedCategory.categoryId, updatedCategory)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (res) => {
  //         this.toastr.success(res.message, 'Success');
  //         this.modalRef.close('success');
  //         this.isSubmitting = false;
  //       },
  //       error: () => {
  //         this.toastr.error('Failed to update category', 'Error');
  //         this.isSubmitting = false;
  //       },
  //     });
  // }

  // private addCategory() {
  //   if (this.categoryForm.invalid) return;

  //   this.isSubmitting = true;
  //   const category: Category = this.categoryForm.value;

  //   this.catServ
  //     .createCat(category)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (res) => {
  //         this.toastr.success(res.message, 'Success');
  //         this.modalRef.close('success');
  //         this.isSubmitting = false;
  //       },
  //       error: () => {
  //         this.toastr.error('Failed to add category', 'Error');
  //         this.isSubmitting = false;
  //       },
  //     });
  // }
  */
}
