import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesRoutingModule } from './pages/pages.routing';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { AuthRoutingModule } from './auth/auth.routing';
import { LoginComponent } from './auth/login/login.component';
import { SubirPagoComponent } from './subir-pago/subir-pago.component';
import { ConfirmacionComponent } from './subir-pago/confirmacion.component';
import { UploadComponent } from './subir-pago/upload.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'subir-pago', component: SubirPagoComponent },
  { path: 'confirmar-pago/:arrDeudas/:idcliente', component: ConfirmacionComponent },
  { path: 'upload-pago/:voucher', component: UploadComponent },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
