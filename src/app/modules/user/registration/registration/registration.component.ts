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

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
    private toastr :ToastrService) {}

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
    const fullNameControl = control.get('fullName');

    if (!fullNameControl) {
      return null;
    }

    const value = fullNameControl.value?.trim();
    if (!value) {
      return null;
    }

    const hasValidFormat = /^[a-zA-Z\u0600-\u06FF\s]{2,}$/.test(value);
    const hasTwoWords = value.split(/\s+/).length >= 2;

    if (!hasValidFormat || !hasTwoWords) {
      return { invalidFullName: true };
    }

    return null;
  };

  formValidation() {
    this.registerForm = this.formBuilder.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)],
        ],
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
        validators: [this.passwordMatchValidator, this.fullNameValidator],
      }
    );
  }

  hasDisplayableError(controlName: string): Boolean {
    const control = this.registerForm.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched))
    );
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
      this.service.createUser(this.registerForm.value).subscribe({
        next: (res :any) => {
          if(res.succeeded) {
            this.registerForm.reset();
            this.isSubmitted = false;
            this.toastr.success('User registered successfully', 'Registration Successful')
          }
          console.log('response: ',res);
        },
        error: (err) => console.log('error' + err),
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
