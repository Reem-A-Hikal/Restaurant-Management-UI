import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { finalize, take } from 'rxjs/operators';
import {
  Address,
  AddressType,
  AddressTypeLabels,
} from '../../models/address.model';
import { AddressService } from '../../services/address.service';
import { ManageAddressModalComponent } from '../manage-address-modal/manage-address-modal.component';
import { extractErrorResponse } from '../../../../shared/helpers/error.helper';
import {
  confirmDestructiveAction,
  showErrorDialog,
  showSuccessDialog,
} from '../../../../shared/helpers/confirm-dialog.helper';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-address-manager',
  standalone: true,
  imports: [CommonModule, MdbModalModule, EmptyStateComponent],
  templateUrl: './address-manager.component.html',
  styleUrls: ['./address-manager.component.css'],
})
export class AddressManagerComponent implements OnInit {
  @Input({ required: true }) userId!: string;

  addresses: Address[] = [];
  isLoading = false;
  isDeleting = false;
  settingDefaultId: number | null = null;

  readonly AddressType = AddressType;
  readonly AddressTypeLabels = AddressTypeLabels;

  modalRef: MdbModalRef<ManageAddressModalComponent> | null = null;

  constructor(
    private readonly addressService: AddressService,
    private readonly modalService: MdbModalService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  get isEmpty(): boolean {
    return !this.isLoading && this.addresses.length === 0;
  }

  typeIcon(type: AddressType): string {
    switch (type) {
      case AddressType.Home:
        return 'bi-house-door';
      case AddressType.Work:
        return 'bi-briefcase';
      default:
        return 'bi-geo-alt';
    }
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.addressService.getUserAddresses(this.userId).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error(
          extractErrorResponse(err, 'Failed to load addresses'),
          'Error',
        );
        this.isLoading = false;
      },
    });
  }

  trackByAddressId(index: number, address: Address): number {
    return address.addressId;
  }

  private openAddressModal(address?: Address): void {
    this.modalRef = this.modalService.open(ManageAddressModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        userId: this.userId,
        addressToEdit: address,
      },
    });

    this.modalRef.onClose.pipe(take(1)).subscribe((result) => {
      if (result === 'success') {
        this.loadAddresses();
      }
    });
  }

  addAddress(): void {
    this.openAddressModal();
  }

  editAddress(address: Address): void {
    this.openAddressModal(address);
  }

  setDefault(address: Address): void {
    if (address.isDefault || this.settingDefaultId) return;

    this.settingDefaultId = address.addressId;
    this.addressService
      .setDefault(this.userId, address.addressId)
      .pipe(finalize(() => (this.settingDefaultId = null)))
      .subscribe({
        next: () => {
          this.toastr.success('Default address updated', 'Success');
          this.loadAddresses();
        },
        error: (err) => {
          this.toastr.error(
            extractErrorResponse(err, 'Failed to set default address'),
            'Error',
          );
        },
      });
  }

  async deleteAddress(address: Address): Promise<void> {
    const confirmed = await confirmDestructiveAction({
      text: "You won't be able to revert this!",
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirmed) return;

    this.isDeleting = true;
    this.addressService
      .delete(this.userId, address.addressId)
      .pipe(finalize(() => (this.isDeleting = false)))
      .subscribe({
        next: () => {
          showSuccessDialog('Deleted!', 'Address deleted successfully.');
          this.loadAddresses();
        },
        error: (err) => {
          showErrorDialog(
            extractErrorResponse(err, 'Failed to delete address'),
          );
        },
      });
  }
}