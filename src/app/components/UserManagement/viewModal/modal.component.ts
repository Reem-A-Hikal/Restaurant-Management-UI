import { Component } from '@angular/core';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from '../../../models/User';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MdbModalModule, DatePipe, CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  user!: User;
  constructor(public modalRef: MdbModalRef<ModalComponent>) {}
}
