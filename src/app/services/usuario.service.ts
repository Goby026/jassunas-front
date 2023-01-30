import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { RegisterForm } from '../interfaces/register-form-interface';
import { LoginForm } from '../interfaces/login-form-interface';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Observable, tap } from 'rxjs';

const base_url = environment.base_url;
const base_login = environment.base_login;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario!: Usuario;

  constructor( private http: HttpClient ) { }

  validarToken(): boolean{
    const token = localStorage.getItem('token') || '';
    if (token) {
      return true;
    }
    return false;
  }

  regUsuario(formData: RegisterForm){
    return this.http.post( `http://localhost:8081/api/v1/usuarios`, formData );
  }

  loginUsuario(formData: LoginForm):Observable<any>{
    return this.http.post<any>( base_login, formData).pipe(
      tap( (resp)=> {
        let payload = JSON.parse(atob(resp.token.split(".")[1]));
        localStorage.setItem('token', resp.token);
        localStorage.setItem('username', payload.sub);
        this.setUsuarioPerfil(payload.sub);
      })
    )
  }

  setToken(token:string){
    localStorage.setItem('token', token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getLocalUser(): Usuario{
    return JSON.parse(localStorage.getItem('usuario') || '');
  }

  setUsuarioPerfil(username:string):void{
    console.log('USERNAME------->', username);
    this.http.get(`${base_url}/usuario/${username}`)
    .subscribe({
      next: (resp) => {
        console.log('RESP----->', resp);
        // localStorage.setItem('usuario', JSON.stringify(resp));
      },
      error: error=> console.log(error)
    });
  }

}
