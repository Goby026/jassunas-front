import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { RegisterForm } from '../interfaces/register-form-interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form-interface';
// import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient ) { }

  regUsuario(formData: RegisterForm){
    return this.http.post( `${base_url}/register`, formData );
  }

  loginUsuario(formData: LoginForm){
    return this.http.post( `${base_url}/login`, formData );
  }

  setToken(token:string){
    localStorage.setItem('_token', token);
  }

  getToken(){
    return localStorage.getItem('_token');
  }

  getUsuarioPerfil(token:string){
    const encabezados = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'My header': 'Mi cabecera personalizada',
      'Authorization': `${token}`
    });
    return this.http.post( `${base_url}/perfil`, { headers:encabezados });
  }

}
