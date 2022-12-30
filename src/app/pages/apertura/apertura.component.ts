import { Component, OnInit } from '@angular/core';
import { Caja } from 'src/app/models/caja.model';
import { CajaService } from 'src/app/services/caja.service';

import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-apertura',
  templateUrl: './apertura.component.html',
  styleUrls: ['./apertura.component.css']
})
export class AperturaComponent implements OnInit {

  cajasArr: Caja[] = [];
  cajasArrVerifi: Caja[] = [];
  caja!: Caja;
  toUpdateCaja! : Caja;
  usuario!: Usuario;

  fechaHoy = moment().format("yyyy-MM-DD");
  cajaForm!: FormGroup;
  estadoCaja: boolean = false;
  panelSeguimiento: boolean = false;

  pagosservicios: any[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [5,10,15,20];

  constructor(
    private cajaService: CajaService,
    private pagoServicios: PagosServiciosService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.verificarEstadoCaja();
    this.listarCajas();
    this.crearFormularioCaja();
  }

  crearFormularioCaja(){
    this.cajaForm = new FormGroup({
      'ncaja': new FormControl('',Validators.required),
      'efectivoape': new FormControl(0.0, Validators.required)
    });
    this.usuario = this.usuarioService.getLocalUser();
  }

  listarCajas(){
    this.cajaService.getAllCajas()
    .subscribe({
      next: (resp: Caja[])=>{
        this.cajasArr = resp;
        // this.cajasArr = resp.map( (item)=> {
        //   item.fapertura = moment(item.fapertura).toDate()
        //   item.fcierre = moment(item.fcierre,'DD-MM-yyyy hh:mm:ss').toDate()
        //   return item;
        // } );
      },
      error: (error)=>console.log(error)
    });
  }

  verificarEstadoCaja(){
    this.cajaService.getCajaStatus()
    .subscribe({
      next: (resp: Caja)=>{
        if(resp.esta!==1){
          this.estadoCaja = true;
        }else{
          this.estadoCaja = false;
          this.caja = resp;
        }
      },
      error: error=> console.log(error)
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

  buscarFecha(fecha: string){
    this.cajaService.findCajaByDate(fecha)
    .subscribe({
       next: (resp)=>{
        this.cajasArr = resp;
      },
      error: (error)=>console.log(error)
    });
  }

  aperturarCaja(){

    let caja: Caja = {
      efectivoape: this.cajaForm.get('efectivoape')?.value,
      esta: 1,
      fapertura: moment().toDate(),
      fcierre: '',
      ncaja: this.cajaForm.get('ncaja')?.value,
      total: 0,
      usuario: this.usuario
    }

    this.cajaService.saveCaja(caja)
    .subscribe({
      next: (resp)=>{
        console.log(resp)
        localStorage.setItem('caja_today', resp.fapertura.toString());
        this.listarCajas();
      },
      error: (error)=>console.log(error),
      complete: ()=>{
        this.verificarEstadoCaja();
      }
    });

  }

  seguimiento(id: any){
    this.panelSeguimiento = true;
    this.pagoServicios.tracking(id)
    .subscribe({
      next: (resp: any)=>{
        this.pagosservicios = resp.pagosservicios;
        this.caja.idcaja = id;
      },
      error: error => console.log(error)
    });
  }


  setearCaja(cajaSel: Caja){
    // cajaSel.total = 0;
    cajaSel.fcierre = moment().toDate();
    cajaSel.esta = 0;
    // devolver caja seteada
    this.toUpdateCaja = cajaSel;
  }

  cerrarCaja(monto:string){
    this.toUpdateCaja.total = Number(monto);
    // console.log(this.toUpdateCaja);
    this.cajaService.closeCaja(this.toUpdateCaja)
    .subscribe({
      next: (resp: any)=>{
        console.log(resp);
      },
      error: error => console.log(error),
      complete: ()=> this.listarCajas()
    });
  }

  onTableDataChange( event: any ){
    this.page = event;
    this.listarCajas();
  }

  onTableSizeChange(event: any):void{
    this.tableSize = event.target.value;
    this.page = 1;
    this.listarCajas();
  }

}
