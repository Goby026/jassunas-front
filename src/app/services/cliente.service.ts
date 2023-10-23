import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoCliente } from '../models/tipoCliente.model';

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

  /*================ LISTAR TODOS LOS SOCIOS ================*/
  listClients(): Observable<Cliente[]>{
    return this.http.get(`${base_url}/clientes`).pipe(
      map( (res: any)=> {
        return res.clientes as Cliente[]
      } )
    );
  }

  /*================ LISTAR SOCIOS POR ZONA ================*/
  listClientsByZona(idzona: number): Observable<Cliente[]>{
    return this.http.get(`${base_url}/clientes/zona/${idzona}`)
    .pipe(
      map( (resp: any)=> {
        return resp.clientes as Cliente[];
      })
    );
  }

  /*================ BUSCAR SOCIO POR DNI ================*/
  searchByDni(dni: string): Observable<Cliente>{
    return this.http.get<Cliente>(`${base_url}/clientes/dni/${dni}`);
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

  /*================ BUSCADOR MEJORADO ================*/
  buscarClientes(cadena: string = ''): Observable<Cliente[]>{
    return this.http.get(`${base_url}/clientes/search/${cadena}`)
    .pipe(
      map( (res:any) => res.clientes as Cliente[] )
    );
  }

  getClientById(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${base_url}/clientes/${id}`);
  }

  getTipoClientes(): Observable<TipoCliente[]>{
    return this.http.get(`${base_url}/tipoClientes`).pipe(
      map( (res:any)=> res.tipoClientes as TipoCliente[] )
    );
  }

  getTipoClienteById(idtipo: number):Observable<TipoCliente>{
    return this.http.get<TipoCliente>(`${base_url}/tipoClientes/${idtipo}`);
  }

  saveClient(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(`${base_url}/clientes`, cliente);
  }

  updateClient(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${base_url}/clientes/${cliente.idclientes}`, cliente);
  }
}
