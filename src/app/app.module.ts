import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from "./app-routing.module";
import { PagesModule } from "./pages/pages.module";
import { AuthModule } from './auth/auth.module';
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { SubirPagoComponent } from './subir-pago/subir-pago.component';
import { ConfirmacionComponent } from './subir-pago/confirmacion.component';
import { UploadComponent } from './subir-pago/upload.component';
import { VouchersComponent } from './pages/cobranzas/vouchers/vouchers.component';
import { PagoSocioComponent } from './subir-pago/pago-socio/pago-socio.component';
import { MesesPipe } from './pipes/meses.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
    SubirPagoComponent,
    ConfirmacionComponent,
    UploadComponent,
    VouchersComponent,
    PagoSocioComponent,
    MesesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,
    PagesModule,
    AuthModule,
    DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
