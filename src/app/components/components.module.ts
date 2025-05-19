import { BodyComponent } from './body/body.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { DashboardBodyComponent } from './dashboardBody/dashboardBody.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    BodyComponent,
    DashboardBodyComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    BodyComponent,
    DashboardBodyComponent,
  ],
})
export class ComponentsModule {}
