import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { RequisitoService } from 'src/app/services/requisito.service';
import { TributoService } from 'src/app/services/tributo.service';
import { TupaService } from 'src/app/services/tupa.service';

import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-tributos',
  templateUrl: './tributos.component.html',
  styleUrls: ['./tributos.component.css']
})
export class TributosComponent implements OnInit {

  tupas: any[] = [];
  requisitos: any[] = [];
  reqSel: any[] = [];
  tributosDetalle: any[] = [];  //MAIN
  cliente: any = {};
  nombre_completo: string = '';
  subTotal: number = 0;

  correlativo: number = 0;
  spinner: boolean = false;

  @Input() idCliente: number = 0;

  constructor( private tributoService: TributoService ,private tupaService: TupaService, private requisitoService: RequisitoService, private activatedRoute: ActivatedRoute, private clienteService: ClienteService, private location :Location ) { }

  ngOnInit(): void {
    // this.idCliente = this.activatedRoute.snapshot.params["idCliente"];
    this.listarTupas();
    this.cargarCliente();
    this.getCorrelativo();
  }

  cargarCliente(){
    this.clienteService.getClientById(this.idCliente)
    .subscribe({
      next: (resp)=>{
        this.cliente = resp;
        this.nombre_completo= `${resp.apepaterno} ${resp.apematerno} ${resp.nombres}`;
      },
      error: error => console.error(error)
    });
  }

  getCorrelativo(){
    this.tributoService.getAllTributes()
    .subscribe({
      next: (resp: any)=>{
        this.correlativo = resp.tributos.length;
      },
      error: error => console.log(error)
    });
  }


  listarTupas(){
    this.tupaService.getAllTupas()
    .subscribe({
      next: ( resp:any )=> {
        this.tupas = resp.tupas;
      },
      error: error => console.log(error)
    });
  }

  seleccionTupa(idTupa: string){

    this.spinner = true;

    if (idTupa !== '0') {
      this.requisitoService.getReqsByTupa(idTupa)
      .subscribe({
        next: ( resp:any )=> {
          this.requisitos = resp.requisitos;
        },
        error: error => console.log(error),
        complete: ()=> this.spinner = false
      });
    }else{
      this.requisitos = [];
      return;
    }
  }

  addRequisito(req: any){
    this.reqSel.push(req);
    this.operaciones();

    //TODO: crear el array de detalles

  }

  quitarRequisito(index: number){
    this.reqSel.splice(index, 1);
    this.operaciones();
  }

  operaciones(){
    this.subTotal = 0;
    this.reqSel.map( (item)=>{
      this.subTotal += Number(item.monto_ref);
    });
  }

  // REGISTRAR TRIBUTO
  registrarTributo(){

    if (this.reqSel.length <= 0) {
      alert('No hay tributos seleccionados');
      return;
    }

    if (!confirm('¿Registrar pago de tributo?')) {
      return;
    }

    let tributo: any = {
      usuario: "TESORERA",
      dettupa: "CONSTRUCCION",
      detrequisito: "PAGOS VARIOS",
      subtotal: this.subTotal,
      cliente: {
        idclientes: this.idCliente
      }
    }

    this.tributoService.saveTributo(tributo)
    .subscribe( {
      next: (resp:any)=>{

        // registrar detalle de tributo
        this.registrarDetalleTributo(resp.iddetatributo);
        this.pagarTributo();
      },
      error: error => console.log(error),
      complete: ()=> {
        this.reqSel = [];
        // this.subTotal = 0;
      }
    } );

  }

  registrarDetalleTributo( idtributo: number ){

    this.reqSel.map( (item)=>{

      let tributoDetalle : any = {
        datosclientes: `${this.cliente.apepaterno} ${this.cliente.apematerno} ${this.cliente.nombres}`,
        direccion: this.cliente.zona.detazona,
        monto: this.subTotal,
        usuaCrea: "TESORERA",
        fecha: Date.now(),
        esta: 1,
        correlativo: this.correlativo,
        idanno: 2022,
        cliente: {
            idclientes: this.idCliente
        },
        requisito: {
            codrequi: item.codrequi
        },
        tributo: {
            iddetatributo: idtributo
        }
      }

      this.tributosDetalle.push(tributoDetalle);

    });

    this.tributoService.saveDetalleTributo(this.tributosDetalle)
    .subscribe({
      next: (resp)=> console.log(resp),
      error: error => console.log(error)
    });

  }


  // TICKET
  getBase64ImageFromURL(url:any) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx:any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  async pagarTributo(){

    let dataPagos: any[] = [];

    this.reqSel.map( (item:any)=>{
      let arrItem = [item.requisitos , moment(item.periodo).format("MMM YYYY"), `S/ ${item.monto_ref}`]
      dataPagos.push(arrItem)
    } );
    // crear pdf
    const pdfDefinition: any = {
      pageSize: {
        width: 249, //B7 - B8
        height: 'auto'
      },
      pageMargins: [ 20, 30, 20, 30 ],
      content: [
        {
          image: await this.getBase64ImageFromURL('../../../assets/img/jass.png'),
          width: 90,
          alignment: 'center'
        },
        {
          text: 'JUNTA ADMINISTRADORA DE SERVICIOS DE SANEAMIENTO',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 8]
        },
        {
          text: 'Av. 30 de Mayo # 250 - Plaza Principal',
          alignment: 'center',
          style: 'small'
        },
        {
          text: 'JUNIN - HUANCAYO - HUANCAYO',
          alignment: 'center',
          style: 'small'
        },
        {
          text: `RECIBO PAGO DE TRIBUTO Nro. 000${this.correlativo + 1}`,
          alignment: 'center',
          style: 'header',
          margin: [0, 8]
        },
        // {
        //   text: `
        //   Cliente: \t\t ${this.idCliente} - ${this.nombre_completo}\n
        //   Direccion: \t\t ${this.direccion} \n
        //   Fecha: \t\t ${new Date()}`,
        //   style: 'small',
        //   margin: [0, 8]
        // },
        {
          alignment: 'justify',
          columns: [
            {
              text: 'Cliente:',
              style: 'small',
              width: 50,
            },
            {
              text: `${this.idCliente} - ${this.nombre_completo}`,
              style: 'small',
              // width: 60,
            }
          ]
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: 'Direccion:',
              style: 'small',
              width: 50,
            },
            {
              text: `${this.cliente.direccion}`,
              style: 'small',
              // width: 60,
            }
          ]
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: 'Fecha:',
              style: 'small',
              width: 50,
            },
            {
              text: `${moment().format('DD-MM-YYYY hh:mm:ss')}`,
              style: 'small',
              // width: 60,
            }
          ]
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', 40, 40],
            body: [
              ['CONCEPTOS', 'MES', 'S.TOTAL'],
              ...dataPagos
            ]
          }
        },
        {
          text: `SON: ${this.subTotal} con 00/100 SOLES`,
          alignment: 'left',
          style: 'small',
          margin: [0, 8]
        },
        {
          text: `
            SUBTOTAL: \t\t S/ ${this.subTotal}.00 \n
            TASAS: \t\t S/ 0.00 \n
            DESCUENTO: \t\t S/ 0.00 \n
            ________________________ \n
          `,
          alignment: 'right',
          style: 'small',
          margin: [0, 8]
        },
        {
          text: `TOTAL A PAGAR: \t\t S/ ${this.subTotal}.00`,
          alignment: 'right',
          style: 'subheader',
          margin: [0, 8]
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true
        },
        subheader: {
          fontSize: 14,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        tableExample: {
          fontSize: 8,
          margin: [0, 0, 0, 0]
        },
      }
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }


}
