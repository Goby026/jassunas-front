import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role.model';

import { Usuario } from '../../models/usuario.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  usuario!: Usuario;
  roles!: Role[];
  rol!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarBien().subscribe();
  }

  obtenerUsuario() {
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.roles = this.usuario.roles!;
    this.rol = this.roles[0].authority!;
  }

  cargarBien(): Observable<any> {
    const obs$ = new Observable((observer) => {
      const intervalo = setInterval(() => {
        observer.next(this.obtenerUsuario());
        if (this.rol.length > 0) {
          clearInterval(intervalo);
          observer.complete();
        }
      }, 500);
    });

    return obs$;
  }

  logout() {
    if (!confirm('¿Salir del sistema?')) {
      return;
    }

    localStorage.clear();
    this.router.navigate(['/login']);
  }

  mantenimiento() {
    alert('Funcionalidad en mantenimiento 👀');
  }
}
