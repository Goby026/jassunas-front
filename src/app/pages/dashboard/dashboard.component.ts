import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  token: any = '';

  constructor(private usuarioService: UsuarioService) {
    this.token = this.usuarioService.getToken();
  }

  ngOnInit(): void {
    this.usuarioService.getUsuarioPerfil(this.token).subscribe({
      next: (resp) => console.log(resp),
      error: (error) => console.error(error),
      complete: () => console.info('get perfil completo'),
    });
    console.log(this.token);
  }
}
