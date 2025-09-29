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
import { Category } from '../../../models/Category';
import { take } from 'rxjs';

@Component({
  selector: 'app-addCategory',
  templateUrl: './addCategory.component.html',
  imports: [CommonModule, ReactiveFormsModule, MdbModalModule],
  styleUrls: ['./addCategory.component.css'],
})
export class AddCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private catServ: CategoryService,
    public modalRef: MdbModalRef<AddCategoryComponent>,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      isActive: [true],
      displayOrder: [1, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;

    this.isSubmitting = true;
    const category = this.categoryForm.value as Category;

    this.catServ
      .createCat(category)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message, 'Success');
          this.modalRef.close(category);
        },
        error: (err) => {
          this.toastr.error(
            err.title || 'Failed to add category',
            'Error'
          );
          this.isSubmitting = false;
        },
      });
  }
}
