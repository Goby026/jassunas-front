import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

import { environment } from 'src/environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor( private usuarioService: UsuarioService ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.usuarioService.validarToken()) {

      if (req.url !== `${base_url}/api/v1/vouchers/save`) {

        const headers = new HttpHeaders({
          // 'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ this.usuarioService.getToken()
        });

        const reqClone = req.clone({
          headers
        });

        return next.handle(reqClone).pipe(
          catchError(this.manejarError)
        );

      }
    }

    return next.handle(req);

  }

  manejarError(error: HttpErrorResponse){
    console.log('Sucedio un error');
    console.log('Registrado en el log file');
    console.warn(error);
    return throwError(error);
  }

}
