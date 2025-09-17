import { UserRole } from '../../../models/User';
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
} from '../../../helpers/validators';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/User.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';

@Component({
  selector: 'app-addUser',
  imports: [
    ReactiveFormsModule,
    MdbFormsModule,
    MdbValidationModule,
    CommonModule,
    MdbTooltipModule,
  ],
  templateUrl: './addUser.component.html',
  styleUrls: ['./addUser.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  UserRole = UserRole;
  roles = [
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Chef, label: 'Chef' },
    { value: UserRole.DeliveryPerson, label: 'Delivery Person' },
  ];
  isSubmitting: boolean = false;
  showPassword!: boolean;

  constructor(
    private fb: FormBuilder,
    private serv: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userForm = this.buildForm();
    this.setupRoleBasedValidation();
  }

  private buildForm(): FormGroup {
    return this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.maxLength(100)]],
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^01[0-5][0-9]{8}$/)],
        ],
        profileImageUrl: [''],
        password: ['', [Validators.required, passwordValidator]],
        confirmPassword: ['', Validators.required],
        userRole: ['', Validators.required],
        specialization: [''],
        vehicleNumber: [''],
        isAvailable: [false],
      },
      {
        validators: confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  private setupRoleBasedValidation(): void {
    this.userForm.get('userRole')?.valueChanges.subscribe((role) => {
      this.applyRoleValidators(role);
    });
  }

  applyRoleValidators(role: UserRole): void {
    const specializationControl = this.userForm.get('specialization');
    const vehicleNumberControl = this.userForm.get('vehicleNumber');
    const isAvailableControl = this.userForm.get('isAvailable');

    specializationControl?.clearValidators();
    vehicleNumberControl?.clearValidators();
    isAvailableControl?.clearValidators();

    specializationControl?.reset('');
    vehicleNumberControl?.reset('');
    isAvailableControl?.reset(false);

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
    isAvailableControl?.updateValueAndValidity();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = { ...this.userForm.value };
      console.log('User form submitted:', formValue);
      this.serv.addUser(formValue).subscribe({
        next: (res) => {
          this.toastr.success(res.message, 'Success');
          this.router.navigateByUrl('/Dashboard/Users');
        },
        error: (err) => {
          this.toastr.error(err.title, 'Error');
          console.log(err);
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigateByUrl('/Dashboard/Users');
  }
}
