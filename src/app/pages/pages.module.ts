import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ZonasComponent } from './zonas/zonas.component';
import { CobranzasComponent } from './cobranzas/cobranzas.component';
import { PagesComponent } from './pages.component';
import { ClientesComponent } from './clientes/clientes.component';
import { AperturaComponent } from './apertura/apertura.component';
import { PagosDeudasCondonacionesComponent } from './cobranzas/pagos-deudas-condonaciones/pagos-deudas-condonaciones.component';
import { CarritoComponent } from './cobranzas/carrito/carrito.component';
import { ClienteDataComponent } from './cobranzas/cliente-data/cliente-data.component';
import { MultasComponent } from './cobranzas/multas/multas.component';
import { AdelantosComponent } from './cobranzas/adelantos/adelantos.component';
import { OcurrenciasComponent } from './cobranzas/ocurrencias/ocurrencias.component';
import { TarifarioComponent } from './cobranzas/tarifario/tarifario.component';
import { TributosComponent } from './cobranzas/tributos/tributos.component';
import { HistorialComponent } from './cobranzas/historial/historial.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ZonasComponent,
    CobranzasComponent,
    PagesComponent,
    ClientesComponent,
    AperturaComponent,
    PagosDeudasCondonacionesComponent,
    CarritoComponent,
    ClienteDataComponent,
    MultasComponent,
    AdelantosComponent,
    OcurrenciasComponent,
    TarifarioComponent,
    TributosComponent,
    HistorialComponent
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
    AppRoutingModule,
    NgxPaginationModule
  ],
})
export class PagesModule {}
