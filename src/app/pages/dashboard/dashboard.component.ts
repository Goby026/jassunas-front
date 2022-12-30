import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  token: any = '';
  username: string = '';

  constructor(
    private usuarioService: UsuarioService
    ) {}

  ngOnInit(): void {
    // this.usuarioService.getUsuarioPerfil(this.token).subscribe({
    //   next: (resp) => console.log(resp),
    //   error: (error) => console.error(error),
    //   complete: () => console.info('get perfil completo'),
    // });
    // console.log(this.token);
    this.getUsername();
  }

  getUsername(){
    this.username = localStorage.getItem('username') || '';
  }
}
