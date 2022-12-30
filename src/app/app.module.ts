import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from "./app-routing.module";
import { PagesModule } from "./pages/pages.module";
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { SubirPagoComponent } from './subir-pago/subir-pago.component';
import { ConfirmacionComponent } from './subir-pago/confirmacion.component';
import { UploadComponent } from './subir-pago/upload.component';
import { VouchersComponent } from './pages/cobranzas/vouchers/vouchers.component';

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
    SubirPagoComponent,
    ConfirmacionComponent,
    UploadComponent,
    VouchersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
