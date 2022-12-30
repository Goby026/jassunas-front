import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { DeudaService } from 'src/app/services/deuda.service';

@Component({
  selector: 'app-pagos-deudas-condonaciones',
  templateUrl: './pagos-deudas-condonaciones.component.html',
  styleUrls: ['./pagos-deudas-condonaciones.component.css']
})
export class PagosDeudasCondonacionesComponent implements OnInit {

  @Input() idCliente: number= 0;
  @Output() deuda = new EventEmitter<object>();

  deudaTotal: number = 0;

  deudas:any[] = [];

  constructor( private deudaService: DeudaService ) { }

  ngOnInit(): void {
    this.mostrarDeudasCliente();
  }

  mostrarDeudasCliente(){
    // this.deudaTotal = 0;
    let cliente: any = {
      "idclientes": this.idCliente
    };

    this.deudaService.getUserDebt(cliente)
    .subscribe({
      next: ( resp:any )=>{
        this.deudas = resp.map( (item:any) =>{
          this.deudaTotal += item.total;
          item.periodo = this.formatFecha(item.periodo);
          item.vencimiento = this.formatFecha(item.vencimiento, 'vencimiento');
          return item;
        });
      },
      error: error=>console.log(error)
    });
  }

  // emitirDeuda(deuda: any, index: number){

  //   let deudaEstado: any = {
  //     "iddeudaEstado": 1
  //   }

  //   this.deudaService.updateUserDebt(deudaEstado, deuda.idtbdeudas)
  //   .subscribe( {
  //     next: ( resp:any )=>{
  //       console.log(resp);
  //       this.mostrarDeudasCliente();
  //     },
  //     error: error=>console.log(error)
  //   } );

  //   this.deuda.emit(deuda);
  //   this.deudas.splice(index, 1);
  // }


  // deudasSelect(e: any){

  //   let elements:any = document.getElementsByName('deuda_');

  //   if (e.target.checked) {
  //     for(let i=0; i<elements.length; i++){
  //       if(elements[i].type=='checkbox')
  //       elements[i].checked=true;
  //     }
  //   } else {
  //     for(let i=0; i<elements.length; i++){
  //         if(elements[i].type=='checkbox')
  //         elements[i].checked=false;
  //     }
  //     this.sub_total = 0;
  //     this.deudaTotal = 0;

  //   }

  // }

  formatFecha(fecha: any, type='periodo'){
    const myDate = moment(fecha);

    let todayDate = '';

    if (type !== 'periodo') {
      return todayDate = myDate.format('DD/MM/YYYY');
    }else{
      return todayDate = myDate.format('MM/YYYY');
    }
  }

}
