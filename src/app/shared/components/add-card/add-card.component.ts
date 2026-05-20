import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-card',
  imports: [CommonModule],
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css'],
})
export class AddCardComponent {
  constructor() {}
  @Output() add = new EventEmitter<void>();
  @Input() symbol: any;
  @Input() title: any;
  @Input() subtitle: any;

  onClick() {
    this.add.emit();
  }
}
