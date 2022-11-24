import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CostoService {

  private encabezados: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // 'Authorization': `${token}`
  });

  constructor( private http: HttpClient ) { }

  // la entidad costos hace referencia a la configuracion de costos del cliente
  getCostsByClient(idCliente: number){
    return this.http.get(`${base_url}/costos/buscar/${idCliente}` , { headers: this.encabezados });
  }
}
