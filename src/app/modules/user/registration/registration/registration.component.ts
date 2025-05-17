import { Message } from './../../../../../../node_modules/@angular/build/node_modules/vite/node_modules/postcss/lib/result.d';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../Core/Auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

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
    private formBuilder: FormBuilder,
    private service: AuthService,
    private toastr: ToastrService
  ) {}

  formValidation() {
    this.registerForm = this.formBuilder.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^[\p{L}\s]+$/u),
            this.fullNameValidator,
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        phone: ['', [Validators.required, Validators.pattern(/^01[0-9]{10}$/)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [this.passwordMatchValidator],
      }
    );
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  };

  fullNameValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = control.value?.trim();

    if (!value) return null;

    const words = value
      .split(/\s+/)
      .filter((word: string | any[]) => word.length > 0);

    if (words.length < 2) {
      return {
        twoWordsRequired:
          'Please enter a valid full name (first and last name)',
      };
    }

    if (!/^[\p{L}\s]+$/u.test(value)) {
      return {
        invalidFormat: {
          message: 'Name should contain only letters',
        },
      };
    }

    return null;
  };

  hasDisplayableError(controlName: string): Boolean {
    const control = this.registerForm.get(controlName);
    if (!control) return false;

    return (
      !!control?.invalid &&
      (this.isSubmitted || control?.touched || control?.dirty)
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control?.errors) return '';

    const errorType = Object.keys(control.errors)[0];

    switch (errorType) {
      case 'required':
        return 'This field is required';

      case 'minlength':
        return `Minimum length is ${control.errors['minlength'].requiredLength}  characters`;

      case 'twoWordsRequired':
        return 'Please enter a valid full name (first and last name)';

      case 'invalidFormat':
        return 'Name should contain only letters';

      case 'pattern':
        return this.getPatternMessage(controlName);

      default:
        return 'Invalid value';
    }
  }

  private getPatternMessage(controlName: string): string {
    switch (controlName) {
      case 'phone':
        return 'Please enter a valid phone number starting with 0 and 11 digits total';

      case 'password':
        return 'Password must contain uppercase, lowercase and numbers';

      case 'email':
        return 'Please enter a valid email address (e.g., user@example.com)';

      default:
        return 'Invalid pattern';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.registerForm.valid) {
      console.log('Sending data:', this.registerForm.value);
      this.service.createUser(this.registerForm.value).subscribe({
        next: (res: any) => {
          if (res.message && res.message.includes('success')) {
            this.registerForm.reset();
            this.isSubmitted = false;
            this.toastr.success(res.message, 'Registration Successful');
          } else {
            console.log('response: ', res);
          }
        },
        error: (err) => {
          console.error('Error details:', err);
          if (err.status === 400 && err.error?.Email) {
            const emailError = err.error.Email[0];
            this.toastr.warning('Email already in use', 'Warning', {
              enableHtml: true,
              timeOut: 5000,
              closeButton: true,
            });
            this.email?.setErrors({ duplicate: true });
          } else {
            this.toastr.error(
              err.error?.message || 'Registration failed',
              'Error'
            );
          }
        },
      });
    } else {
      console.log('Form Invalid', this.registerForm.errors);
    }
  }

  ngOnInit(): void {
    this.formValidation();
  }

  get fullName() {
    return this.registerForm.get('fullName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get phone() {
    return this.registerForm.get('phone');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
