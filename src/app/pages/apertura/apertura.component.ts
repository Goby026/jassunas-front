import { Component, OnInit } from '@angular/core';
import { Caja } from 'src/app/models/caja.model';
import { CajaService } from 'src/app/services/caja.service';

import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';



@Component({
  selector: 'app-apertura',
  templateUrl: './apertura.component.html',
  styleUrls: ['./apertura.component.css'],
})
export class AperturaComponent implements OnInit {


  cajasArr: Caja[] = [];
  cajasArrVerifi: Caja[] = [];
  caja!: Caja;
  toUpdateCaja!: Caja;
  usuario!: Usuario;


  fechaHoy = moment().format('yyyy-MM-DD');
  cajaForm!: FormGroup;
  estadoCaja: boolean = false;
  panelSeguimiento: boolean = false;

  /* PAGINACION */
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [5, 10, 15, 20];

  constructor(
    private cajaService: CajaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.verificarEstadoCaja();
    this.listarCajas();
    this.crearFormularioCaja();
  }

  crearFormularioCaja() {
    this.cajaForm = new FormGroup({
      ncaja: new FormControl('', Validators.required),
      efectivoape: new FormControl(0.0, Validators.required),
    });
    this.usuario = this.usuarioService.getLocalUser();
  }

  listarCajas() {
    this.cajaService.getAllCajas().subscribe({
      next: (resp: Caja[]) => {
        this.cajasArr = resp;
      },
      error: (error) => console.log(error),
    });
  }

  verificarEstadoCaja() {
    this.cajaService.getCajaStatus().subscribe({
      next: (resp: Caja) => {
        if (resp) {
          this.caja = resp;
          if (resp.esta !== 1) {
            this.estadoCaja = true;
          } else {
            this.estadoCaja = false;
          }
        } else {
          alert('No hay resultado de caja');
          this.estadoCaja = true;
        }
      },
      error: (error) => console.error(error),
    });
  }

  // verificarEstadoCaja(fecha: string){
  //   this.cajaService.findCajaByDate(fecha)
  //   .subscribe({
  //      next: (resp)=>{
  //       this.cajasArrVerifi = resp;
  //     },
  //     error: (error)=>console.log(error),
  //     complete: ()=>{
  //       if(this.cajasArrVerifi.length > 0){
  //         this.estadoCaja = false;
  //       }else{
  //         this.estadoCaja = true;
  //       }
  //     }
  //   });
  // }

  buscarFecha(fecha: string) {
    this.cajaService.findCajaByDate(fecha).subscribe({
      next: (resp) => {
        this.cajasArr = resp;
      },
      error: (error) => console.log(error),
    });
  }

  aperturarCaja() {
    if (!this.cajaForm.valid) {
      alert('Indique correctamente los datos!');
      return;
    }

    if (!confirm('¿Aperturar caja?')) {
      return;
    }

    let caja: Caja = {
      efectivoape: this.cajaForm.get('efectivoape')?.value,
      esta: 1,
      fapertura: moment().toDate(),
      fcierre: '',
      ncaja: this.cajaForm.get('ncaja')?.value,
      total: 0,
      totalefectivo: 0,
      totalegresos: 0,
      balance: 0,
      obs: '',
      usuario: this.usuario,
    };

    this.cajaService.saveCaja(caja).subscribe({
      next: (resp: Caja) => {
        localStorage.setItem('caja_today', resp.fapertura.toString());
      },
      error: (error) => console.log(error),
      complete: () => {
        alert('Caja aperturada correctamente');
        this.listarCajas();
        this.verificarEstadoCaja();
      },
    });
  }



  setearCaja(cajaSel: Caja): void {
    // cajaSel.total = 0;
    cajaSel.fcierre = moment().toDate();
    // cajaSel.esta = 0;
    // devolver caja seteada
    this.toUpdateCaja = cajaSel;
  }



  cerrarCaja(): void {
    this.toUpdateCaja.total = 0.0;
    this.toUpdateCaja.esta = 0;
    this.cajaService.closeCaja(this.toUpdateCaja).subscribe({
      next: (resp: any) => {
        console.log(resp);
      },
      error: (error) => console.log(error),
      complete: () => this.listarCajas(),
    });
  }

  calculos(): void {
    this.toUpdateCaja.balance = Number(
      this.toUpdateCaja.totalefectivo - this.toUpdateCaja.total
    );
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.listarCajas();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.listarCajas();
  }
}
