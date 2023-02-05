import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

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

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(localStorage.getItem('email') || '', [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
    // remember: new FormControl(false)
  });

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.invalid) {
      alert('Datos incompletos');
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
          alert(resp.msg);
          this.router.navigate(['/dashboard']);
        }
      },
      error: ({error}) => {
        error === '' || error.msg === undefined ? this.errogMsg = 'Algo salio mal' : this.errogMsg = error.msg;

        alert(this.errogMsg = error.msg);
      },
      complete: () => console.log('Login completo'),
    });
  }

  setRemember(valor: boolean){
    this.remember = valor;
  }

  mantenimiento(){
    alert('Funcionalidad en mantenimiento');
    return;
  }
}
