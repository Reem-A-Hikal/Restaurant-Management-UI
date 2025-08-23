import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { navbarData } from './navData';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { AuthService } from '../../../Core/Auth/services/auth.service';

interface SideNavToggle {
  screenWidth: number;
  isCollapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MdbTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  @Output() onToggleSidenav: EventEmitter<SideNavToggle> = new EventEmitter();
  isCollapsed = false;
  navData = navbarData;
  screenWidth = 0;
  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.isCollapsed = false;
      this.onToggleSidenav.emit({
        isCollapsed: this.isCollapsed,
        screenWidth: this.screenWidth,
      });
    }
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.onToggleSidenav.emit({
      isCollapsed: this.isCollapsed,
      screenWidth: this.screenWidth,
    });
  }
  closeSidenav(): void {
    this.isCollapsed = false;
    this.onToggleSidenav.emit({
      isCollapsed: this.isCollapsed,
      screenWidth: this.screenWidth,
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/signin')
  }
}
