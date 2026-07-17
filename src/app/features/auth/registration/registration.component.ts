import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Core/Auth/services/auth.service';
import {
  confirmPasswordValidator,
  fullNameValidator,
  passwordValidator,
} from '../../../shared/helpers/validators';
import { HttpErrorResponse } from '@angular/common/http';
import { extractErrorResponse } from '../../../shared/helpers/error.helper';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitted: boolean = false;
  isSubmitting: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly service: AuthService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.formBuilder.group(
      {
        fullName: ['', [Validators.required, fullNameValidator]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            ),
          ],
        ],
        phone: ['', [Validators.required, Validators.pattern(/^01\d{9}$/)]],
        password: ['', [Validators.required, passwordValidator]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [confirmPasswordValidator('password', 'confirmPassword')],
      },
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return (
      !!control?.invalid &&
      (control?.touched || control?.dirty || this.isSubmitted)
    );
  }

  getError(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control?.errors) return '';

    const firstError = Object.values(control.errors)[0];

    return typeof firstError === 'string' ? firstError : 'Invalid value';
  }

  get confirmPasswordError(): string | null {
    const control = this.f['confirmPassword'];
    const passwordControl = this.f['password'];

    if (!control || !passwordControl) return null;
    if (
      !control.touched &&
      !control.dirty &&
      !this.isSubmitted &&
      !passwordControl.value
    )
      return null;

    if (!passwordControl.value) return null;

    if (control?.hasError('required')) return 'Please confirm your password';
    if (this.registerForm.hasError('passwordMismatch'))
      return 'Passwords do not match';
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.registerForm.invalid) {
      this.isSubmitting = false;
      console.log('Form Invalid', this.registerForm.errors);
      return;
    }

    this.isSubmitting = true;

    this.service.createUser(this.registerForm.value).subscribe({
      next: () => {
        this.registerForm.reset();
        this.isSubmitting = false;
        this.isSubmitted = false;
        this.toastr.success(
          'Registration successful! You can now sign in.',
          'Success',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.isSubmitted = false;
        this.toastr.error(
          extractErrorResponse(err, 'Registration failed'),
          'Registration failed',
        );
      },
    });
  }
}
