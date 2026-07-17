import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AdminUpdateRequest,
  User,
  UserRole,
  UserStatus,
} from '../../models/user.model';
import { ImageUploadService } from '../../../../shared/services/image-upload.service';
import { toAssetUrl } from '../../../../shared/helpers/url.helper';
import { finalize } from 'rxjs/operators';
import {
  readFileAsDataUrl,
  validateImageFile,
} from '../../../../shared/helpers/file-validation.helper';

interface StatusAction {
  status: UserStatus;
  label: string;
  icon: string;
  variant: 'success' | 'muted' | 'danger';
  confirmText: string;
}

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [DatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  editForm!: FormGroup;
  user!: User;
  isLoading = false;
  isSaving = false;
  isUploadingImage = false;
  isChangingStatus = false;

  UserRole = UserRole;
  UserStatus = UserStatus;

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  toAssetUrl = toAssetUrl;

  readonly statusActions: StatusAction[] = [
    {
      status: UserStatus.Active,
      label: 'Activate',
      icon: 'bi-check-circle',
      variant: 'success',
      confirmText: 'This will restore full account access.',
    },
    {
      status: UserStatus.Inactive,
      label: 'Deactivate',
      icon: 'bi-pause-circle',
      variant: 'muted',
      confirmText: 'The user will not be able to log in until reactivated.',
    },
    {
      status: UserStatus.Suspended,
      label: 'Suspend',
      icon: 'bi-slash-circle',
      variant: 'danger',
      confirmText: 'This restricts account access due to a policy violation.',
    },
  ];

  get isChef(): boolean {
    return this.user?.role?.includes('Chef');
  }

  get isDeliveryPerson(): boolean {
    return this.user?.role?.includes('DeliveryPerson');
  }

  get hasRoleSpecificFields(): boolean {
    return this.isChef || this.isDeliveryPerson;
  }

  /** Admin cannot change a Customer's profile picture — only staff roles. */
  get isImageEditable(): boolean {
    return this.user?.role !== 'Customer';
  }

  get statusLabel(): string {
    switch (this.user?.status) {
      case UserStatus.Active:
        return 'Active';
      case UserStatus.Inactive:
        return 'Inactive';
      case UserStatus.Suspended:
        return 'Suspended';
      default:
        return 'Unknown';
    }
  }

  get statusBadgeClass(): string {
    switch (this.user?.status) {
      case UserStatus.Active:
        return 'status-badge--active';
      case UserStatus.Inactive:
        return 'status-badge--inactive';
      case UserStatus.Suspended:
        return 'status-badge--suspended';
      default:
        return '';
    }
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly imageUploadService: ImageUploadService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      specialization: [''],
      vehicleNumber: [''],
      isAvailable: [true],
    });

    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) this.loadUser(userId);
  }

  loadUser(userId: string) {
    this.isLoading = true;
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.editForm.patchValue({
          specialization: user.specialization || '',
          vehicleNumber: user.vehicleNumber || '',
          isAvailable: user.isAvailable ?? true,
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load user', 'Error');
        this.router.navigateByUrl('/Dashboard/Staff');
      },
    });
  }

  // ── Image handling ──
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

  // ── Status change (immediate action, separate from the role-data form) ──
  async changeStatus(action: StatusAction) {
    if (
      !this.user ||
      this.user.status === action.status ||
      this.isChangingStatus
    )
      return;

    const Swal = await import('sweetalert2');
    const result = await Swal.default.fire({
      title: `${action.label} this user?`,
      text: action.confirmText,
      icon: action.variant === 'danger' ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action.label.toLowerCase()}`,
      confirmButtonColor: action.variant === 'danger' ? '#ba1a1a' : '#00643f',
    });

    if (!result.isConfirmed) return;

    this.isChangingStatus = true;
    const request: AdminUpdateRequest = { status: action.status };

    this.userService
      .adminUpdateUser(this.user.id, request)
      .pipe(finalize(() => (this.isChangingStatus = false)))
      .subscribe({
        next: () => {
          this.user = {
            ...this.user,
            status: action.status,
            isActive: action.status === UserStatus.Active,
          };
          this.toastr.success(
            `User ${action.label.toLowerCase()}d successfully`,
            'Success',
          );
        },
        error: (err) => {
          this.toastr.error(
            err.error?.message || 'Failed to update status',
            'Error',
          );
        },
      });
  }

  // ── Role-specific data + image save ──
  onSubmit(): void {
    if (this.editForm.invalid || !this.user) return;
    this.isSaving = true;

    if (this.selectedFile) {
      this.isUploadingImage = true;
      this.imageUploadService
        .upload(this.selectedFile, 'users')
        .pipe(finalize(() => (this.isUploadingImage = false)))
        .subscribe({
          next: (res) => this.saveChanges(res.imageUrl, res.imageUrl),
          error: () => {
            this.isSaving = false;
            this.toastr.error('Failed to upload image', 'Error');
          },
        });
    } else {
      this.saveChanges(undefined, null);
    }
  }

  private saveChanges(
    profileImageUrl: string | undefined,
    uploadedImageUrl: string | null,
  ): void {
    const formValue = this.editForm.value;
    const roleUpdate: AdminUpdateRequest = {
      specialization: this.isChef
        ? formValue.specialization || undefined
        : undefined,
      vehicleNumber: this.isDeliveryPerson
        ? formValue.vehicleNumber || undefined
        : undefined,
      isAvailable: this.isDeliveryPerson ? formValue.isAvailable : undefined,
    };

    this.userService.adminUpdateUser(this.user.id, roleUpdate).subscribe({
      next: () => {
        if (profileImageUrl) {
          this.userService
            .updateProfile(this.user.id, { profileImageUrl })
            .subscribe({
              next: () => this.finishSave(),
              error: (err) => this.handleSaveError(err, uploadedImageUrl),
            });
        } else {
          this.finishSave();
        }
      },
      error: (err) => this.handleSaveError(err, uploadedImageUrl),
    });
  }

  private finishSave(): void {
    this.isSaving = false;
    this.toastr.success('Changes saved successfully', 'Success');
    setTimeout(() => this.router.navigate(['/Dashboard/Staff']), 800);
  }

  private handleSaveError(err: any, uploadedImageUrl: string | null): void {
    this.isSaving = false;
    if (uploadedImageUrl) {
      this.imageUploadService
        .delete(uploadedImageUrl)
        .subscribe({ error: () => {} });
    }
    this.toastr.error(err.error?.message || 'Failed to save changes', 'Error');
  }

  goBack(): void {
    this.router.navigateByUrl('/Dashboard/Staff');
  }
}
