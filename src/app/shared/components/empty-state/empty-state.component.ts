import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css'],
})
export class EmptyStateComponent {
  @Input() icon: string = ''; // اسم الأيقونة أو مسارها
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = '';

  @Output() add = new EventEmitter<void>();

  onAdd(): void {
    this.add.emit();
  }
}
