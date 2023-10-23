import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Year } from '../models/Year.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class YearsService {

  constructor( private http: HttpClient ) { }

  getYears(): Observable<Year[]>{
    return this.http.get( `${base_url}/years` ).pipe(
      map( (res: any)=> res.years as Year[] )
    );
  }

}
