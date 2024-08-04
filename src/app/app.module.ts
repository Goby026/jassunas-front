import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from "./app-routing.module";
import { PagesModule } from "./pages/pages.module";
import { AuthModule } from './auth/auth.module';
import { DataTablesModule } from 'angular-datatables';
import locales from "@angular/common/locales/es";
import {registerLocaleData} from "@angular/common";

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { SubirPagoComponent } from './subir-pago/subir-pago.component';
import { ConfirmacionComponent } from './subir-pago/confirmacion.component';
import { UploadComponent } from './subir-pago/upload.component';
import { VouchersComponent } from './pages/cobranzas/vouchers/vouchers.component';
import { PagoSocioComponent } from './subir-pago/pago-socio/pago-socio.component';
import { MesesPipe } from './pipes/meses.pipe';

registerLocaleData(locales, 'es');

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
  providers: [
    {provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
