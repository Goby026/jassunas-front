import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + localStorage.getItem('token')
  //   })
  // };

  constructor( private http: HttpClient ) { }

  listClients(){
    return this.http.get(`${base_url}/clientes`);
  }

  findClients(nombre: string = '', dni:string= '', ape:string=''){
    let miParams = new HttpParams()
                      .set('nombre', nombre)
                      .set('ape', ape)
                      .set('dni', dni);
    return this.http.get(`${base_url}/clientes/buscar`, {
      params: miParams
    });
  }

  getClientById(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${base_url}/clientes/${id}`);
  }

  getTipoClientes(){
    return this.http.get(`${base_url}/tipoClientes`);
  }

  saveClient(cliente: Cliente){
    return this.http.post(`${base_url}/clientes`, cliente);
  }
}
