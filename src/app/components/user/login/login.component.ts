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
  isSubmitted: Boolean = false;
  showPassword: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.FormValidation();
    // if (this.service.isAdmin()) {
    //   this.router.navigateByUrl('/dashboard');
    // } else {
    //   this.router.navigateByUrl('/main');
    // }
  }

  FormValidation() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hasDisplayableError(controlName: string): Boolean {
    const control = this.loginForm.get(controlName);
    if (!control) return false;

    return (
      !!control?.invalid &&
      (this.isSubmitted || control?.touched || control?.dirty)
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.service.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (this.service.isAdmin()) {
            this.router.navigate(['/Dashboard']);
          } else {
            this.router.navigate(['/main']);
          }
          // console.log(res.message)
        },
        error: (err) => {
          if (err.status == 400) {
            this.toastr.error('Invalid email or password', 'Login failed');
          } else {
            // console.log('Error during login: \n', err);
          }
        },
      });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
