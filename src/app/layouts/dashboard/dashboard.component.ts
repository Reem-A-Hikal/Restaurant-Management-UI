import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { BodyComponent } from '../../shared/components/body/body.component';

interface SideNavToggle {
  screenWidth: number;
  isCollapsed: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [SidebarComponent, BodyComponent],
})
export class DashboardComponent {
  isSideNavCollapsed: boolean = false;
  screenWidth: number = 0;
  constructor() {}

  onToggleSidenav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.isCollapsed;
  }
}
