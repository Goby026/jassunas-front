import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ZonasComponent } from './zonas/zonas.component';
import { CobranzasComponent } from './cobranzas/cobranzas.component';
import { PagesComponent } from './pages.component';
import { ClientesComponent } from './clientes/clientes.component';
import { AperturaComponent } from './apertura/apertura.component';
import { PagosDeudasCondonacionesComponent } from './cobranzas/pagos-deudas-condonaciones/pagos-deudas-condonaciones.component';
import { CarritoComponent } from './cobranzas/carrito/carrito.component';
import { ClienteDataComponent } from './clientes/cliente-data/cliente-data.component';
import { MultasComponent } from './cobranzas/multas/multas.component';
import { AdelantosComponent } from './cobranzas/adelantos/adelantos.component';
import { OcurrenciasComponent } from './cobranzas/ocurrencias/ocurrencias.component';
import { TarifarioComponent } from './tarifario/tarifario.component';
import { TributosComponent } from './tributos/tributos.component';
import { HistorialComponent } from './historial/historial.component';
import { CondonacionComponent } from './cobranzas/condonacion/condonacion.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../interceptors/auth-interceptor.service';

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
    HistorialComponent,
    CondonacionComponent
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
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class PagesModule {}
