import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CobranzasComponent } from './cobranzas/cobranzas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { ZonasComponent } from './zonas/zonas.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'zonas', component: ZonasComponent },
      { path: 'cobranzas', component: CobranzasComponent },
      // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
