import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { AuthService } from '../../../Core/Auth/services/auth.service';
import { UserService } from '../../../features/users/services/user.service';
import { toAssetUrl } from '../../helpers/url.helpers';
import { navbarData } from './navData';

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
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('150ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  @Output() toggleSidenav: EventEmitter<SideNavToggle> = new EventEmitter();
  isCollapsed = false;
  navData = navbarData;
  screenWidth = 0;

  isProfileMenuOpen = false;
  toAssetUrl = toAssetUrl;

  currentUser: { fullName: string; profileImageUrl?: string } | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.currentUser = { fullName: this.authService.getCurrentUserFullName() };

    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.currentUser = {
            fullName: user.fullName,
            profileImageUrl: user.profileImageUrl,
          };
        },
        error: () => {},
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.isCollapsed = false;
      this.toggleSidenav.emit({
        isCollapsed: this.isCollapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.isProfileMenuOpen &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidenav.emit({
      isCollapsed: this.isCollapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.isCollapsed = false;
    this.toggleSidenav.emit({
      isCollapsed: this.isCollapsed,
      screenWidth: this.screenWidth,
    });
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  onLogout() {
    this.isProfileMenuOpen = false;
    this.authService.logout();
    this.router.navigateByUrl('/signin');
  }
}
