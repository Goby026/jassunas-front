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

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
  });

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.usuarioService.loginUsuario(this.loginForm.value).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.usuarioService.setToken(resp.data.token);
          this.router.navigate(['/dashboard']);
        }
      },
      error: ({error}) => this.errogMsg = error.message,
      complete: () => console.log('Login completo'),
    });
  }
}
