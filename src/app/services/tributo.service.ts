import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TributoService {

  constructor( private http: HttpClient ) { }

  getAllTributes(){
    return this.http.get(`${base_url}/tributos`);
  }

  saveTributo(tributo: any){
    return this.http.post(`${base_url}/tributos`, tributo);
  }

  saveDetalleTributo(detalles: any[]){
    return this.http.post(`${base_url}/tributo-detalles/service`, detalles);
  }
}
