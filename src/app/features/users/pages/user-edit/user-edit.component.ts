import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminUpdateRequest, User, UserRole } from '../../models/user.model';

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
  UserRole = UserRole;
  addresses!: any[];
  orders!: any[];
  activeTab: string = 'profile';

  roles = [
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Chef, label: 'Chef' },
    { value: UserRole.DeliveryPerson, label: 'Delivery Person' },
    { value: 'Customer', label: 'Customer' },
  ];

  get isChef(): boolean {
    return this.user?.role?.includes('Chef');
  }

  get isDeliveryPerson(): boolean {
    return this.user?.role?.includes('DeliveryPerson');
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      isActive: [true],
      specialization: [''],
      vehicleNumber: [''],
      isAvailable: [true],
    });

    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      this.loadUser(userId);
    }
  }

  loadUser(userId: string) {
    this.isLoading = true;
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.editForm.patchValue({
          isActive: user.isActive,
          specialization: user.specialization || '',
          vehicleNumber: user.vehicleNumber || '',
          isAvailable: user.isAvailable ?? true,
        });
        this.isLoading = false;
      },
      error: () => {
        console.error('Failed to load user', 'Error');
        this.isLoading = false;
        this.router.navigateByUrl('/Dashboard/Staff');
      },
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  buildRequest(): AdminUpdateRequest {
    const formValue = this.editForm.value;
    return {
      isActive: formValue.isActive,
      specialization: this.isChef
        ? formValue.specialization || undefined
        : undefined,
      vehicleNumber: this.isDeliveryPerson
        ? formValue.vehicleNumber || undefined
        : undefined,
      isAvailable: this.isDeliveryPerson ? formValue.isAvailable : undefined,
    };
  }

  updateUser() {
    const request: AdminUpdateRequest = this.buildRequest();

    this.userService.adminUpdateUser(this.user.id, request).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastr.success(
          res.message || 'Profile updated successfully',
          'Success',
        );
        setTimeout(() => this.router.navigate(['/Dashboard/Staff']), 1000);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(
          err.error?.message || 'Failed to update user',
          'Error',
        );
      },
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid || !this.user) return;

    this.isSaving = true;
    this.updateUser();
  }

  goBack(): void {
    this.router.navigateByUrl('/Dashboard/Staff');
  }
}
