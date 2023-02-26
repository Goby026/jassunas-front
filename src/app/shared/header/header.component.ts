import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role.model';

import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario!: Usuario;
  roles!: Role[];
  rol: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario(){
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.roles = this.usuario.roles!;
    this.rol = this.roles[0].authority!;
  }


  logout(){
    if (!confirm('¿Salir del sistema?')) {
      return;
    }

    localStorage.clear();
    this.router.navigate(['/login']);

  }

  mantenimiento(){
    alert('Funcionalidad en mantenimiento 👀');
  }

}
