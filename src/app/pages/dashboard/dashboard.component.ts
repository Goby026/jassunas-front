import { Component, OnInit } from '@angular/core';
import { Caja } from 'src/app/models/caja.model';
import { CajaService } from 'src/app/services/caja.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  token: any = '';
  username: string = '';
  estadoCaja: boolean = false;
  caja!: Caja;
  currentMonth: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private cajaService: CajaService
    ) {}

  ngOnInit(): void {
    this.getUser();
    this.usuarioService.setUsuarioPerfil(localStorage.getItem('username') || '');
    this.verificarEstadoCaja();
    this.currentMonth = moment().format('MMMM');
  }

  verificarEstadoCaja(){
    this.cajaService.getCajaStatus()
    .subscribe({
      next: (resp: Caja)=>{
        if (resp) {
          this.caja = resp;
          if(resp.esta!==1){
            this.estadoCaja = true;
          }else{
            this.estadoCaja = false;
          }
        }else{
          alert('No hay resultado de caja');
        }
      },
      error: error=> console.error(error)
    });
  }

  getUser(){
    this.username = localStorage.getItem('username') || '';
  }
}
