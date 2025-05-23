import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../models/services/User.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../Core/Auth/models/User';
import { AddressService } from '../../../models/services/Address.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editUser',
  standalone: false,
  templateUrl: './editUser.component.html',
  styleUrls: ['./editUser.component.css'],
})
export class EditUserComponent implements OnInit {
  editForm: FormGroup;
  user!: User;
  isLoading = false;
  isSuccess = false;
  addresses!: any[];
  orders!: any[];
  activeTab: string = 'profile';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private addressService: AddressService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.editForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      phoneNumber: ['', Validators.pattern(/^01[0-9]{9}$/)],
      roles: [[]],
    });
  }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserData(userId);
      this.loadUserAddresses(userId);
      this.loadUserOrders(userId);
    }
  }

  loadUserData(userId: string) {
    this.isLoading = true;
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.populateForm(user);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user data', err);
        this.isLoading = false;
      },
    });
  }

  loadUserAddresses(userId: string) {
    // this.addressService.getUserAddresses(userId).subscribe({
    //   next: (addresses) => {
    //     this.addresses = addresses;
    //     console.log(addresses);
    //   },
    //   error: (err) => {
    //     console.error('Failed to load addresses', err);
    //   },
    // });
  }

  loadUserOrders(userId: string) {
    // this.orderService.getUserOrders(userId).subscribe({
    //   next: (orders) => {
    //     this.orders = orders;
    //   },
    //   error: (err) => {
    //     console.error('Failed to load orders', err);
    //   },
    // });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  populateForm(user: User): void {
    this.editForm.patchValue({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      roles: user.roles || [],
    });
  }
  onSubmit(): void {
    if (this.editForm.valid && this.user) {
      this.isLoading = true;
      const updatedUser = { ...this.user, ...this.editForm.value };

      this.userService.updateUser(this.user.id, updatedUser).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Profile updated successfully');
          setTimeout(() => this.router.navigate(['/Home/Users']), 1000);
        },
        error: (err) => {
          console.error('Failed to update user', err);
          this.isLoading = false;
          this.toastr.error('Failed to update user');
        },
      });
    }
  }
}
