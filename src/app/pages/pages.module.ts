import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ZonasComponent } from './zonas/zonas.component';
import { CobranzasComponent } from './cobranzas/cobranzas.component';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ZonasComponent,
    CobranzasComponent,
    PagesComponent,
  ],
  exports:[
    DashboardComponent,
    ZonasComponent,
    CobranzasComponent,
    PagesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
  ],
})
export class PagesModule {}
