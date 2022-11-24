import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor( private http: HttpClient ) { }

  listClients(){
    return this.http.get(`${base_url}/clientes`);
  }

  findClients(nombre: string){
    return this.http.get(`${base_url}/clientes/listar/${nombre}`);
  }

  getClientById(id: number){
    return this.http.get(`${base_url}/clientes/${id}`);
  }
}
