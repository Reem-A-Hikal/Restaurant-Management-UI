import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from "../../shared/admin/header/admin-header/admin-header.component";
import { AdminFooterComponent } from "../../shared/admin/footer/admin-footer/admin-footer.component";
import { AdminSidebarComponent } from "../../shared/admin/sidebar/admin-sidebar/admin-sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminHeaderComponent, AdminFooterComponent, AdminSidebarComponent,RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
