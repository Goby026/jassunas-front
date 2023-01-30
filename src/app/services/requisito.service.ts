import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Requisito } from '../models/requisito.model';

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

  getAllRequisitos(): Observable<Requisito[]>{
    return this.http.get(`${base_url}/requisitos`)
    .pipe(
      map( (resp:any)=> {
        return resp.requisitos as Requisito[]
      })
    );
  }
}
