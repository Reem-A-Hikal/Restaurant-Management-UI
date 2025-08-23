import { Component } from '@angular/core';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from '../../../Core/Auth/models/User';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MdbModalModule, DatePipe],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  user!: User;
  constructor(public modalRef: MdbModalRef<ModalComponent>) {}
}
