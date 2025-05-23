import { BodyComponent } from './body/body.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { DashboardBodyComponent } from './dashboardBody/dashboardBody.component';
import { UserManagementComponent } from './UserManagement/UserList/UserManagement.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailsComponent } from './UserManagement/UserDetails/UserDetails.component';
import { EditUserComponent } from './UserManagement/editUser/editUser.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    BodyComponent,
    DashboardBodyComponent,
    UserManagementComponent,
    UserDetailsComponent,
    EditUserComponent,
    ProductsComponent,
    CategoriesComponent,
    OrdersComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    BodyComponent,
    DashboardBodyComponent,
    UserManagementComponent,
    UserDetailsComponent,
    EditUserComponent,
    ProductsComponent,
    CategoriesComponent,
    OrdersComponent,
  ],
})
export class ComponentsModule {}
