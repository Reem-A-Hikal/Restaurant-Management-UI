import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CreateDishRequest,
  DishWithId,
  ProductStatus,
  UpdateDishRequest,
} from '../../models/dish.model';
import { Category } from '../../../categories/models/category.model';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { DishesService } from '../../services/dishes.service';
import { ImageUploadService } from '../../../../shared/services/image-upload.service';
import { ToastrService } from 'ngx-toastr';
import { discountRangeValidator } from '../../../../shared/helpers/validators';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { toAssetUrl } from '../../../../shared/helpers/url.helpers';

@Component({
  selector: 'app-manage-dish',
  imports: [CommonModule, ReactiveFormsModule, MdbModalModule],
  templateUrl: './manage-dish-modal.component.html',
  styleUrls: ['./manage-dish-modal.component.css'],
})
export class ManageDishModalComponent implements OnInit {
  dishForm!: FormGroup;
  isSubmitting = false;
  isUploadingImage = false;
  editMode = false;

  dishToEdit?: DishWithId;
  categories: Category[] = [];
  title?: string;

  imagePreviewUrl: string | null = null;
  selectedFile: File | null = null;

  ProductStatus = ProductStatus;

  get isAvailable(): boolean {
    return this.dishForm.get('status')?.value === ProductStatus.Available;
  }

  constructor(
    public modalRef: MdbModalRef<ManageDishModalComponent>,
    private readonly fb: FormBuilder,
    private readonly dishesService: DishesService,
    private readonly imageUploadService: ImageUploadService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.editMode = !!this.dishToEdit;
    this.imagePreviewUrl = this.dishToEdit?.imageUrl
      ? toAssetUrl(this.dishToEdit.imageUrl)
      : null;
    this.initForm();
  }

  toAssetUrl = toAssetUrl;

  private initForm(): void {
    this.dishForm = this.fb.group(
      {
        name: [
          this.dishToEdit?.name || '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ],
        ],
        categoryId: [this.dishToEdit?.categoryId ?? '', Validators.required],
        price: [
          this.dishToEdit?.price ?? null,
          [Validators.required, Validators.min(0.01)],
        ],
        description: [
          this.dishToEdit?.description || '',
          Validators.maxLength(1000),
        ],
        preparationTime: [
          this.dishToEdit?.preparationTime ?? 10,
          [Validators.required, Validators.min(1)],
        ],
        calories: [
          this.dishToEdit?.calories ?? null,
          [Validators.min(0), Validators.max(10000)],
        ],
        isPromoted: [this.dishToEdit?.isPromoted ?? false],
        discountPercent: [
          this.dishToEdit?.discountPercent ?? 0,
          [Validators.required, Validators.min(0), Validators.max(100)],
        ],
        allowedDiscountPercent: [
          this.dishToEdit?.allowedDiscountPercent ?? 0,
          [Validators.required, Validators.min(0), Validators.max(100)],
        ],
        status: [this.dishToEdit?.status ?? ProductStatus.Available],
      },
      { validators: discountRangeValidator },
    );
  }

  onAvailabilityToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.dishForm.patchValue({
      status: checked ? ProductStatus.Available : ProductStatus.Unavailable,
    });
  }

  get f() {
    return this.dishForm.controls;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.toastr.error(
        'Only JPG, PNG, or WEBP images are allowed',
        'Invalid file',
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toastr.error('Image size cannot exceed 5MB', 'File too large');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.imagePreviewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
  }

  onSubmit(): void {
    if (this.dishForm.invalid || this.isSubmitting) {
      this.dishForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    if (this.selectedFile) {
      this.isUploadingImage = true;
      this.imageUploadService
        .upload(this.selectedFile, 'products')
        .pipe(finalize(() => (this.isUploadingImage = false)))
        .subscribe({
          next: (res) => this.saveDish(res.imageUrl, res.imageUrl),
          error: () => {
            this.isSubmitting = false;
            this.toastr.error('Failed to upload image', 'Error');
          },
        });
    } else {
      this.saveDish(
        this.editMode ? this.dishToEdit?.imageUrl : undefined,
        null,
      );
    }
  }

  private saveDish(
    imageUrl: string | undefined,
    uploadedImageUrl: string | null,
  ): void {
    const formValue = this.dishForm.value;

    const handleError = (message: string) => {
      if (uploadedImageUrl) {
        this.imageUploadService.delete(uploadedImageUrl).subscribe({
          error: () => {},
        });
      }
      this.toastr.error(message, 'Error');
    };

    if (this.editMode && this.dishToEdit) {
      const dto: UpdateDishRequest = {
        name: formValue.name,
        categoryId: Number(formValue.categoryId),
        price: Number(formValue.price),
        description: formValue.description || undefined,
        preparationTime: Number(formValue.preparationTime),
        calories: formValue.calories ?? undefined,
        isPromoted: formValue.isPromoted,
        discountPercent: Number(formValue.discountPercent),
        allowedDiscountPercent: Number(formValue.allowedDiscountPercent),
        status: Number(formValue.status),
        imageUrl: imageUrl ?? undefined,
      };

      this.dishesService
        .update(this.dishToEdit.productId, dto)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            this.toastr.success('Dish updated successfully', 'Success');
            this.modalRef.close('success');
          },
          error: (err) =>
            handleError(err.error?.message || 'Failed to update dish'),
        });
    } else {
      const dto: CreateDishRequest = {
        name: formValue.name,
        categoryId: Number(formValue.categoryId),
        price: Number(formValue.price),
        description: formValue.description || undefined,
        preparationTime: Number(formValue.preparationTime),
        calories: formValue.calories ?? undefined,
        isPromoted: formValue.isPromoted,
        discountPercent: Number(formValue.discountPercent),
        allowedDiscountPercent: Number(formValue.allowedDiscountPercent),
        imageUrl: imageUrl ?? undefined,
      };

      this.dishesService
        .create(dto)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            this.toastr.success('Dish created successfully', 'Success');
            this.modalRef.close('success');
          },
          error: (err) =>
            handleError(err.error?.message || 'Failed to create dish'),
        });
    }
  }
}
