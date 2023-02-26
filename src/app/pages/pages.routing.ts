import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AdelantosComponent } from './cobranzas/adelantos/adelantos.component';
import { AperturaComponent } from './apertura/apertura.component';
import { ClienteDataComponent } from './clientes/cliente-data/cliente-data.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CobranzasComponent } from './cobranzas/cobranzas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistorialComponent } from './historial/historial.component';
import { PagesComponent } from './pages.component';
import { TributosComponent } from './tributos/tributos.component';
import { ZonasComponent } from './zonas/zonas.component';
import { TarifarioComponent } from './tarifario/tarifario.component';
import { VouchersComponent } from './cobranzas/vouchers/vouchers.component';
import { CarritoComponent } from './cobranzas/carrito/carrito.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
      { path: 'zonas', component: ZonasComponent, data: { titulo: 'Zonas' } },
      { path: 'cobranzas', component: CobranzasComponent, data: { titulo: 'Cobranzas' } },
      { path: 'clientes', component: ClientesComponent, data: { titulo: 'Clientes' } },
      { path: 'historial/:idCliente', component: HistorialComponent, data: { titulo: 'Historial' } },
      { path: 'tributos/:idCliente', component: TributosComponent, data: { titulo: 'Tributos' } },
      { path: 'adelantos/:idCliente', component: AdelantosComponent, data: { titulo: 'Adelantos' } },
      { path: 'tarifarios/:idClientes', component: TarifarioComponent, data: { titulo: 'Tarifarios' } },
      { path: 'cliente-data', component: ClienteDataComponent, data: { titulo: 'Cliente-data' } },
      { path: 'caja', component: AperturaComponent, data: { titulo: 'Caja' } },
      { path: 'vouchers', component: VouchersComponent, data: { titulo: 'Confirmar-Vouchers' } },
      { path: 'carrito', component: CarritoComponent, data: { titulo: 'Pagos' } },
      { path: 'reportes', component: ReportesComponent, data: { titulo: 'Reportes' } },
      { path: 'configuracion', component: ConfiguracionComponent, data: { titulo: 'Configuración' } },
      // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
