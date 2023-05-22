import { Component, OnInit } from '@angular/core';

import { SidebarService } from "../../services/sidebar.service";
import { Usuario } from 'src/app/models/usuario.model';
import { Role } from 'src/app/models/role.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  usuario!: Usuario;
  roles!: Role[];
  rol: string = '';
  logo: string = '';

  menuItems!: any[];

  constructor( private service: SidebarService ) {
  }

  ngOnInit(): void {
    this.cargarBien().subscribe();
    this.logo = this.service.logoPath;
  }

  obtenerUsuario(){
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.roles = this.usuario.roles!;
    this.rol = this.roles[0].authority!;
  }

  cargarBien(): Observable<any> {
    const obs$ = new Observable( observer => {
      const intervalo = setInterval( ()=>{
        observer.next( this.obtenerUsuario() );
        if(this.rol.length > 0){
          this.menuItems = this.service.filtrarAccesos(this.rol);
          clearInterval(intervalo);
          observer.complete();
        }
      }, 500 );
    });

    return obs$;
  }

}
