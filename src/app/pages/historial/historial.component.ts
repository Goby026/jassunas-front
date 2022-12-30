import { Component, Input, OnInit } from '@angular/core';

import { ClienteService } from 'src/app/services/cliente.service';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  @Input() idCliente: number = 0;
  historial: PagosServicioDetalle[] = [];
  cliente: any = {};

  constructor(
    // private activatedRoute: ActivatedRoute,
    private pagosService: PagosServiciosService,
    private clienteService: ClienteService ) { }

  ngOnInit(): void {
    // this.idCliente = this.activatedRoute.snapshot.params["idCliente"];
    console.log('IDCLIENTE------>',this.idCliente);
    this.cargarCliente();
    this.cargarHistorial();
  }


  crearPdf(){
    const pdfDefinition: any = {
      pageSize: {
        width: 'A4', //B7 - B8
        height: 'auto'
      },
      content: [
        {
          style: 'tableExample',
          table: {
            widths: [100, 100, '*', 100, 200, '*', 100],
            body: [
              ['width=100', 'star-sized', 'width=200', 'star-sized'],
              ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}]
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  cargarCliente(){
    this.clienteService.getClientById(this.idCliente)
    .subscribe({
      next: (resp)=>{
        this.cliente = resp;
      },
      error: error => console.error(error)
    });
  }

  cargarHistorial(){
    this.pagosService.getHistorial(this.idCliente)
    .subscribe({
      next: (resp:PagosServicioDetalle[])=>{
        this.historial = resp;
      },
      error: (error)=> console.log(error)
    });
  }

}
