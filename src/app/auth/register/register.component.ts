import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    '../../../assets/vendor/css/pages/page-auth.css',
    '../../../assets/vendor/css/core.css',
    '../../../assets/vendor/css/theme-default.css',
    '../../../assets/css/demo.css'
  ]
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  public formRegistro: FormGroup= new FormGroup({
    'name': new FormControl(null, [Validators.required, Validators.minLength(3)]),
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'password': new FormControl(null, Validators.required),
    'c_password': new FormControl(null, Validators.required),
    'terminos': new FormControl(false, Validators.required),
  });

  constructor( private usuarioService: UsuarioService, private router: Router ){ }

  ngOnInit(): void {
  }

  crearUsuario(){
    this.formSubmitted = true;
    console.log(this.formRegistro.value);

    if (this.formRegistro.invalid) {
      return;
    }

    // let usuario: Usuario = {
    //   name: this.formRegistro.get('name')?.value,
    //   email: this.formRegistro.get('email')?.value,
    //   username: this.formRegistro.get('username')?.value
    // }

    this.usuarioService.regUsuario(this.formRegistro.value)
    .subscribe( (resp)=>{
      console.log('usuario registrado --->', resp);

      this.router.navigate(['/dashboard']);

    }, error => console.warn(error) );
  }

  campoNoValido(campo:string):boolean{
    if (this.formRegistro.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    }else{
      return false;
    }
  }

  contrasenasNoValidas(){
    const pass1 = this.formRegistro.get('password')?.value;
    const pass2 = this.formRegistro.get('c_password')?.value;

    if ( (pass1 !== pass2) && this.formSubmitted ) {
      return true;
    }else{
      return false;
    }
  }


  aceptaTerminos(){
    return !this.formRegistro.get('terminos')?.value && this.formSubmitted;
  }

  passwordsIguales(pass1Name:string, pass2Name:string){
    return ( formGroup: FormGroup )=> {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      }else{
        pass2Control?.setErrors({
          noEsIgual: true
        });
      }
    }
  }

}
