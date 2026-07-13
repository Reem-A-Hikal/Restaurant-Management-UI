import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { toAssetUrl } from '../../../../shared/helpers/url.helpers';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() user!: User;
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<User>();

  toAssetUrl = toAssetUrl;

  get displayName(): string {
    return this.user.fullName;
  }

  get roleBadgeClass(): { label: string; css: string } {
    const r = this.user.role.toLowerCase();
    let css = 'badge--default';
    if (r === 'admin') css = 'badge--admin';
    else if (r === 'chef') css = 'badge--chef';
    else if (r === 'deliveryperson') css = 'badge--logistics';
    else if (r === 'customer') css = 'badge--customer';
    return { label: r, css };
  }

  get secondaryInfo(): { icon: string; text: string } | null {
    if (this.user.role.includes('Chef') && this.user.specialization) {
      return { icon: 'restaurant', text: this.user.specialization };
    }
    if (this.user.role.includes('DeliveryPerson') && this.user.vehicleNumber) {
      return { icon: 'motorcycle', text: `ID: #${this.user.vehicleNumber}` };
    }
    return null;
  }

  get statusLabel(): string {
    return this.user.isActive ? 'Active' : 'Inactive';
  }

  onEdit() {
    this.edit.emit(this.user);
  }

  onDelete() {
    this.delete.emit(this.user);
  }
}
