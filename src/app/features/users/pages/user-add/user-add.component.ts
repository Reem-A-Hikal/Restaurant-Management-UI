import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import {
  confirmPasswordValidator,
  passwordValidator,
} from '../../../../shared/helpers/validators';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { CreateUserRequest, UserRole } from '../../models/user.model';
import { ImageUploadService } from '../../../../shared/services/image-upload.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-add',
  imports: [
    ReactiveFormsModule,
    MdbFormsModule,
    MdbValidationModule,
    CommonModule,
    MdbTooltipModule,
  ],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  UserRole = UserRole;
  isSubmitting: boolean = false;
  isUploadingImage: boolean = false;
  showPassword: boolean = false;

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;

  roles = [
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Chef, label: 'Chef' },
    { value: UserRole.DeliveryPerson, label: 'Delivery Person' },
    { value: UserRole.Customer, label: 'Customer' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly imageUploadService: ImageUploadService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userForm = this.buildForm();
    this.setupRoleValidation();
  }

  private buildForm(): FormGroup {
    return this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.maxLength(100)]],
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)],
        ],
        profileImageUrl: [''],
        password: ['', [Validators.required, passwordValidator]],
        confirmPassword: ['', Validators.required],
        userRole: ['', Validators.required],
        specialization: [''],
        vehicleNumber: [''],
        isAvailable: [true],
      },
      {
        validators: confirmPasswordValidator('password', 'confirmPassword'),
      },
    );
  }

  private setupRoleValidation(): void {
    this.userForm.get('userRole')?.valueChanges.subscribe((role) => {
      this.applyRoleValidators(role);
    });
  }

  applyRoleValidators(role: UserRole): void {
    const specializationControl = this.userForm.get('specialization');
    const vehicleNumberControl = this.userForm.get('vehicleNumber');

    specializationControl?.clearValidators();
    vehicleNumberControl?.clearValidators();

    specializationControl?.reset('');
    vehicleNumberControl?.reset('');

    if (role === UserRole.Chef) {
      specializationControl?.setValidators([
        Validators.required,
        Validators.minLength(3),
      ]);
    } else if (role === UserRole.DeliveryPerson) {
      vehicleNumberControl?.setValidators([
        Validators.required,
        Validators.minLength(6),
      ]);
    }

    specializationControl?.updateValueAndValidity();
    vehicleNumberControl?.updateValueAndValidity();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
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

  get f() {
    return this.userForm.controls;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    if (this.selectedFile) {
      this.isUploadingImage = true;
      this.imageUploadService
        .upload(this.selectedFile, 'users')
        .pipe(finalize(() => (this.isUploadingImage = false)))
        .subscribe({
          next: (res) => this.createUser(res.imageUrl, res.imageUrl),
          error: () => {
            this.isSubmitting = false;
            this.toastr.error('Failed to upload image', 'Error');
          },
        });
    } else {
      this.createUser(undefined, null);
    }
  }

  private createUser(
    profileImageUrl: string | undefined,
    uploadedImageUrl: string | null,
  ): void {
    const { confirmPassword, ...formData } = this.userForm.value;
    const request: CreateUserRequest = { ...formData, profileImageUrl };

    this.userService.addUser(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastr.success('User created successfully', 'Success');
        this.router.navigateByUrl('/Dashboard/Staff');
      },
      error: (err) => {
        this.isSubmitting = false;
        if (uploadedImageUrl) {
          this.imageUploadService
            .delete(uploadedImageUrl)
            .subscribe({ error: () => {} });
        }
        this.toastr.error(
          err.error?.message ||
            err.error?.errors?.[0] ||
            'Failed to create user',
          'Error',
        );
      },
    });
  }

  goBack() {
    this.router.navigateByUrl('/Dashboard/Staff');
  }

  get confirmPasswordError(): string {
    const confirmControl = this.f['confirmPassword'];

    if (!confirmControl.touched) return '';

    if (confirmControl.errors?.['required']) {
      return 'Please confirm your password';
    }

    if (this.userForm.errors?.['passwordMismatch']) {
      return this.userForm.errors['passwordMismatch'];
    }

    return '';
  }

  get isConfirmPasswordInvalid(): boolean {
    const confirmControl = this.f['confirmPassword'];
    return (
      confirmControl.touched &&
      (confirmControl.errors?.['required'] ||
        !!this.userForm.errors?.['passwordMismatch'])
    );
  }
}
