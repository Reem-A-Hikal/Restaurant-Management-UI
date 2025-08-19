import { Component } from '@angular/core';
import { MdbModalModule, MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MdbModalModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  constructor(public modalRef: MdbModalRef<ModalComponent>) {}
}
