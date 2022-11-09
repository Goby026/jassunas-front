import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  constructor( private http: HttpClient ) { }

  getUserDebt(iduser: number){
    // console.log(`${base_url}/deudas/usuario?usuario=${iduser}`);
    return this.http.get(`${base_url}/deudas/usuario?usuario=${iduser}`);
  }
}
