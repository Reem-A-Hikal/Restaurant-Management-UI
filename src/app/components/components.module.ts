import { BodyComponent } from './shared/body/body.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { DashboardBodyComponent } from './dashboardBody/dashboardBody.component';
import { UserManagementComponent } from './UserManagement/UserList/UserManagement.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailsComponent } from './UserManagement/UserDetails/UserDetails.component';
import { EditUserComponent } from './UserManagement/editUser/editUser.component';
import { CategoriesComponent } from './categories/categories.component';
import { OrdersComponent } from './orders/orders.component';
import { dishesComponent } from './products/dishes.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    FormsModule,
    ReactiveFormsModule,
    MdbModalModule,
    FormsModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    BodyComponent,
    DashboardBodyComponent,
    UserDetailsComponent,
    EditUserComponent,
    dishesComponent,
    CategoriesComponent,
    OrdersComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    BodyComponent,
    DashboardBodyComponent,
    UserDetailsComponent,
    EditUserComponent,
    dishesComponent,
    CategoriesComponent,
    OrdersComponent,
  ],
})
export class ComponentsModule {}
