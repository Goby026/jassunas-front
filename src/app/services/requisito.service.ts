import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class RequisitoService {

  constructor( private http: HttpClient ) { }

  getReqsByTupa(idTupa: string){
    return this.http.post(`${base_url}/requisitos/tupa`,{
      "codtupa": idTupa
    });
  }

  getReqById(codrequi: number){
    return this.http.get(`${base_url}/requisitos/${codrequi}`);
  }
}
