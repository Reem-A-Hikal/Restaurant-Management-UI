import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ToastrService } from 'ngx-toastr';
import {
  Category,
  CategoryCreateDto,
  CategoryStatus,
  CategoryStatusLabels,
  CategoryUpdateDto,
} from '../../models/category.model';
import { Observable, take } from 'rxjs';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-modal',
  imports: [CommonModule, ReactiveFormsModule, MdbModalModule],
  templateUrl: './manage-category-modal.component.html',
  styleUrls: ['./manage-category-modal.component.css'],
})
export class ManageCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  isSubmitting: boolean = false;
  editMode: boolean = false;
  categoryToEdit?: Category;
  title?: string;

  CategoryStatus = CategoryStatus;
  statusOptions = Object.entries(CategoryStatusLabels).map(
    ([value, label]) => ({
      value: Number(value),
      label,
    }),
  );

  constructor(
    public modalRef: MdbModalRef<ManageCategoryComponent>,
    private readonly fb: FormBuilder,
    private readonly catServ: CategoryService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.editMode = !!this.categoryToEdit;

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

      status: [
        this.categoryToEdit?.status ?? CategoryStatus.Active,
        Validators.required,
      ],

      displayOrder: [
        this.categoryToEdit?.displayOrder ?? 1,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;

    const formValue = this.categoryForm.value;
    if (this.editMode && this.categoryToEdit) {
      const dto: CategoryUpdateDto = {
        ...this.categoryToEdit,
        name: formValue.name,
        status: Number(formValue.status),
        displayOrder: Number(formValue.displayOrder),
      };
      this.saveCategory(
        this.catServ.update(this.categoryToEdit.categoryId, dto),
      );
    } else {
      const dto: CategoryCreateDto = this.categoryForm.value;
      this.saveCategory(this.catServ.create(dto));
    }
  }

  private saveCategory(request$: Observable<any>) {
    request$.pipe(take(1)).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Saved successfully', 'Success');
        this.modalRef.close('success');
        this.isSubmitting = false;
      },
      error: () => {
        this.toastr.error('Failed to save category', 'Error');
        this.isSubmitting = false;
      },
    });
  }
}
