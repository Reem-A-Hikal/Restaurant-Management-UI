import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import {
  Address,
  AddressCreateDto,
  AddressType,
  AddressTypeLabels,
  AddressUpdateDto,
} from '../../models/address.model';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-manage-address-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MdbModalModule],
  templateUrl: './manage-address-modal.component.html',
  styleUrls: ['./manage-address-modal.component.css'],
})
export class ManageAddressModalComponent implements OnInit {
  addressForm!: FormGroup;
  isSubmitting = false;
  editMode = false;

  /** Required — injected via MdbModalService `data` */
  userId!: string;
  addressToEdit?: Address;

  readonly AddressType = AddressType;
  readonly typeOptions = Object.entries(AddressTypeLabels).map(
    ([value, label]) => ({
      value: Number(value),
      label,
    }),
  );

  constructor(
    public modalRef: MdbModalRef<ManageAddressModalComponent>,
    private readonly fb: FormBuilder,
    private readonly addressService: AddressService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.editMode = !!this.addressToEdit;
    this.initForm();
  }

  private initForm(): void {
    this.addressForm = this.fb.group({
      addressLine1: [
        this.addressToEdit?.addressLine1 || '',
        [Validators.required, Validators.maxLength(255)],
      ],
      addressLine2: [
        this.addressToEdit?.addressLine2 || '',
        [Validators.maxLength(255)],
      ],
      city: [
        this.addressToEdit?.city || '',
        [Validators.required, Validators.maxLength(100)],
      ],
      governorate: [this.addressToEdit?.governorate || ''],
      addressType: [
        this.addressToEdit?.addressType ?? AddressType.Home,
        Validators.required,
      ],
      isDefault: [this.addressToEdit?.isDefault ?? false],
    });
  }

  get f() {
    return this.addressForm.controls;
  }

  onSubmit(): void {
    if (this.addressForm.invalid || this.isSubmitting) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.addressForm.value;

    if (this.editMode && this.addressToEdit) {
      const dto: AddressUpdateDto = {
        addressLine1: formValue.addressLine1,
        addressLine2: formValue.addressLine2 || undefined,
        city: formValue.city,
        governorate: formValue.governorate || undefined,
        addressType: Number(formValue.addressType),
        isDefault: formValue.isDefault,
      };
      this.saveAddress(
        this.addressService.update(
          this.userId,
          this.addressToEdit.addressId,
          dto,
        ),
      );
    } else {
      const dto: AddressCreateDto = {
        addressLine1: formValue.addressLine1,
        addressLine2: formValue.addressLine2 || undefined,
        city: formValue.city,
        governorate: formValue.governorate || undefined,
        addressType: Number(formValue.addressType),
        isDefault: formValue.isDefault,
      };
      this.saveAddress(this.addressService.create(this.userId, dto));
    }
  }

  private saveAddress(request$: Observable<Address | void>): void {
    request$.pipe(take(1)).subscribe({
      next: () => {
        this.toastr.success('Address saved successfully', 'Success');
        this.modalRef.close('success');
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toastr.error(
          err.error?.message || 'Failed to save address',
          'Error',
        );
        this.isSubmitting = false;
      },
    });
  }
}
