import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../users/services/user.service';
import { AuthService } from '../../../../Core/Auth/services/auth.service';
import { ImageUploadService } from '../../../../shared/services/image-upload.service';
import { toAssetUrl } from '../../../../shared/helpers/url.helper';
import { User } from '../../../users/models/user.model';
import { readFileAsDataUrl, validateImageFile } from '../../../../shared/helpers/file-validation.helper';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
  user!: User;
  profileForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  isUploadingImage = false;

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  toAssetUrl = toAssetUrl;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly imageUploadService: ImageUploadService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      phoneNumber: ['', [Validators.pattern(/^01[0125]\d{8}$/)]],
    });

    this.loadOwnProfile();
  }

  private loadOwnProfile(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.isLoading = true;
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          fullName: user.fullName,
          phoneNumber: user.phoneNumber || '',
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load your profile', 'Error');
      },
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  async onFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const result = validateImageFile(file);
  if (!result.valid) {
    this.toastr.error(result.error!, 'Invalid file');
    return;
  }

  this.selectedFile = file;
  this.imagePreviewUrl = await readFileAsDataUrl(file);
}

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    if (this.selectedFile) {
      this.isUploadingImage = true;
      this.imageUploadService
        .upload(this.selectedFile, 'users')
        .pipe(finalize(() => (this.isUploadingImage = false)))
        .subscribe({
          next: (res) => this.saveProfile(res.imageUrl, res.imageUrl),
          error: () => {
            this.isSaving = false;
            this.toastr.error('Failed to upload image', 'Error');
          },
        });
    } else {
      this.saveProfile(undefined, null);
    }
  }

  private saveProfile(
    profileImageUrl: string | undefined,
    uploadedImageUrl: string | null,
  ): void {
    const formValue = this.profileForm.value;

    this.userService
      .updateProfile(this.user.id, {
        fullName: formValue.fullName,
        phoneNumber: formValue.phoneNumber || undefined,
        profileImageUrl,
      })
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.toastr.success('Profile updated successfully', 'Success');
          this.selectedFile = null;
          this.loadOwnProfile(); // نعيد التحميل عشان نتأكد إن كل حاجة متزامنة
        },
        error: (err) => {
          if (uploadedImageUrl) {
            this.imageUploadService
              .delete(uploadedImageUrl)
              .subscribe({ error: () => {} });
          }
          this.toastr.error(
            err.error?.message || 'Failed to update profile',
            'Error',
          );
        },
      });
  }
}
