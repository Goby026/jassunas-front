import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { TributosComponent } from './cobranzas/tributos/tributos.component';
import { HistorialComponent } from './cobranzas/historial/historial.component';
import { CondonacionComponent } from './cobranzas/condonacion/condonacion.component';
import { AuthInterceptorService } from '../interceptors/auth-interceptor.service';
import { BuscadorComponent } from './clientes/buscador/buscador.component';
import { ReportesComponent } from './reportes/reportes.component';
import { CostoComponent } from './costo/costo.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { DataTablesModule } from 'angular-datatables';

import { BuscadorDatatableComponent } from './clientes/buscador/buscador-datatable.component';
import { RepoteBycajaComponent } from './reportes/repote-bycaja.component';
import { RepoteByclienteComponent } from './reportes/repote-bycliente.component';
import { RepoteByzonaComponent } from './reportes/repote-byzona.component';
import { RepoteBytupaComponent } from './reportes/repote-bytupa.component';
import { RepoteByfechasComponent } from './reportes/repote-byfechas.component';
import { SeguimientoComponent } from './apertura/seguimiento/seguimiento.component';
import { ReporteBytributoComponent } from './reportes/reporte-bytributo.component';
import { EgresosComponent } from './egresos/egresos.component';
import { EgresoformComponent } from './egresos/egresoform.component';
import { ConfigTarifasComponent } from './configuracion/config-tarifas/config-tarifas.component';
import { FormularioComponent } from './configuracion/config-tarifas/formulario.component';
import { CateEgresosComponent } from './configuracion/cate-egresos/cate-egresos.component';
import { FormCateComponent } from './configuracion/cate-egresos/form-cate.component';
import { ReporteEgresosComponent } from './reportes/reporte-egresos/reporte-egresos.component';
import { TipomultasComponent } from './configuracion/tipomultas/tipomultas.component';
import { AccesosComponent } from './configuracion/accesos/accesos.component';
import { ReporteMultasComponent } from './reportes/reporte-multas/reporte-multas.component';
import { DescuentosComponent } from './cobranzas/descuentos/descuentos.component';
import { ComprobantesIngreso1Component } from './costo/comprobantes-ingreso1/comprobantes-ingreso1.component';
import { ReportesMensuales2Component } from './costo/reportes-mensuales2/reportes-mensuales2.component';
import { CuentasCobrar3Component } from './costo/cuentas-cobrar3/cuentas-cobrar3.component';
import { ConceptosCobrables4Component } from './costo/conceptos-cobrables4/conceptos-cobrables4.component';
import { ConceptosCobrados5Component } from './costo/conceptos-cobrados5/conceptos-cobrados5.component';
import { AdminComponent } from './admin/admin.component';
import { CortesComponent } from './apertura/cortes/cortes.component';
import { DetallecorteComponent } from './apertura/cortes/detallecorte/detallecorte.component';

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
    CondonacionComponent,
    BuscadorComponent,
    ReportesComponent,
    CostoComponent,
    ConfiguracionComponent,
    FormularioComponent,
    BuscadorDatatableComponent,
    RepoteBycajaComponent,
    RepoteByclienteComponent,
    RepoteByzonaComponent,
    RepoteBytupaComponent,
    RepoteByfechasComponent,
    SeguimientoComponent,
    ReporteBytributoComponent,
    EgresosComponent,
    EgresoformComponent,
    ConfigTarifasComponent,
    CateEgresosComponent,
    FormCateComponent,
    ReporteEgresosComponent,
    TipomultasComponent,
    AccesosComponent,
    ReporteMultasComponent,
    DescuentosComponent,
    ComprobantesIngreso1Component,
    ReportesMensuales2Component,
    CuentasCobrar3Component,
    ConceptosCobrables4Component,
    ConceptosCobrados5Component,
    AdminComponent,
    CortesComponent,
    DetallecorteComponent
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
    ReactiveFormsModule,
    DataTablesModule
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
