import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../Core/Auth/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  isLoading = false;
  showPassword: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control?.invalid && (this.isSubmitted || control?.touched);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const requestStartTime = Date.now();
    const minimumLoadingDuration = 400; // ms

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const elapsed = Date.now() - requestStartTime;
        const remainingDelay = Math.max(minimumLoadingDuration - elapsed, 0);

        setTimeout(() => {
          this.isLoading = false;
          if (this.authService.isAdmin()) {
            this.router.navigate(['/Dashboard']);
          } else if (this.authService.hasRole('Chef')) {
            this.router.navigate(['/Dashboard']);
          } else {
            this.router.navigate(['/main']);
          }
        }, remainingDelay);
      },
      error: (err) => {
        const elapsed = Date.now() - requestStartTime;
        const remainingDelay = Math.max(minimumLoadingDuration - elapsed, 0);

        setTimeout(() => {
          this.isLoading = false;
          if (err.status === 400) {
            this.toastr.error('Invalid email or password', 'Login failed');
          } else {
            this.toastr.error(
              'Something went wrong, please try again',
              'Error',
            );
          }
        }, remainingDelay);
      },
    });
  }
}
