import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ingreso } from 'src/app/models/ingreso.model';
import { Usuario } from 'src/app/models/usuario.model';
import { IngresoService } from 'src/app/services/ingreso.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    '../../../assets/vendor/css/pages/page-auth.css',
    '../../../assets/vendor/css/core.css',
    '../../../assets/vendor/css/theme-default.css',
    '../../../assets/css/demo.css',
  ],
})
export class LoginComponent implements OnInit {

  errogMsg: string = '';
  remember: boolean = false;
  usuario!: Usuario;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(localStorage.getItem('email') || '', [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
    // remember: new FormControl(false)
  });

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private ingresoService: IngresoService
    ) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.invalid) {
      Swal.fire({
        title: 'Error!',
        text: '¡Datos incompletos!',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }

    if (this.remember) {
      localStorage.setItem('email', this.loginForm.get('email')?.value);
    }else{
      localStorage.removeItem('email');
    }

    this.usuarioService.loginUsuario(this.loginForm.value)
    .subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          this.usuarioService.setToken(resp.token);
          // alert(resp.msg);
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido!',
            text: resp.msg,
            // confirmButtonText: 'Cerrar',
          });
          // this.router.navigate(['/dashboard']);
        }
      },
      error: ({error}) => {
        error === '' || error.msg === undefined ? this.errogMsg = 'Algo salio mal' : this.errogMsg = error.msg;

        // alert(this.errogMsg = error.msg);
        Swal.fire({
          title: 'Error!',
          text: this.errogMsg = error.msg,
          icon: 'error',
          confirmButtonText: 'Cerrar',
        });
      },
      complete: () => {
        this.setUsuario();
      },
    });
  }

  setUsuario(){
    this.usuarioService.findByUsername(this.loginForm.get('username')?.value)
    .subscribe({
      next: (resp:Usuario)=> {
        this.usuario = resp;
      },
      error: error => console.log(error),
      complete: ()=>{
        this.registrarIngreso(this.usuario)
      }
    });
  }

  registrarIngreso(usuario: Usuario){
    let ingreso: Ingreso = new Ingreso(
      moment().format('yyyy-MM-DD hh:mm:ss'),'',usuario
    );
    this.ingresoService.saveIngreso(ingreso).subscribe({
      next: (resp)=> console.log('Acceso registrado'),
      error: err => console.log(err),
      complete: ()=>{
        this.router.navigate(['/dashboard']);
      }
    });
  }

  setRemember(valor: boolean){
    this.remember = valor;
  }

  mantenimiento(){
    // alert('Funcionalidad en mantenimiento');
    Swal.fire({
      title: 'Oops!',
      text: '¡Funcionalidad en mantenimiento!',
      icon: 'warning',
      confirmButtonText: 'Cerrar',
    });
    return;
  }
}
