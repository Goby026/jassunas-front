import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ItemTicket } from 'src/app/interfaces/items-ticket-interface';
import { Cliente } from 'src/app/models/cliente.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export class TicketPago{

  constructor(
      public correlativo: number | null,
      // public idCliente: number,
      public cliente: Cliente,
      // public nombre_completo: string,
      // public direccion: string,
      // public monto: number,
      public pagos:ItemTicket[],
      public fechaPago?: string | ''
  ){}

  async pagar(montoPagado: number) {
    let dataPagos: any[] = [];

    this.pagos.map((item: ItemTicket) => {
      let arrItem = [
        'MANTENIMIENTO',
        item.fecha,
        `S/ ${item.monto}`,
      ];
      dataPagos.push(arrItem);
    });

    // crear pdf
    const pdfDefinition: any = {
      pageSize: {
        width: 235, //B7 - B8
        height: 'auto',
      },
      pageMargins: [20, 30, 20, 30],
      content: [
        {
          image: await this.getBase64ImageFromURL(
            '../../../assets/img/jass.png'
          ),
          width: 90,
          alignment: 'center',
        },
        {
          text: 'JUNTA ADMINISTRADORA DE SERVICIOS DE SANEAMIENTO',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 8],
        },
        {
          text: 'Av. 30 de Mayo # 250 - Plaza Principal',
          alignment: 'center',
          style: 'small',
        },
        {
          text: 'JUNIN - HUANCAYO - HUANCAYO',
          alignment: 'center',
          style: 'small',
        },
        {
          text: `RECIBO DE CUOTA FAMILIAR Nro. 000${this.correlativo}`,
          alignment: 'center',
          style: 'header',
          margin: [0, 8],
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
              text: `${this.cliente.idclientes} - ${this.getNombreCompleto}`,
              style: 'small',
              // width: 60,
            },
          ],
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
            },
          ],
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
            },
          ],
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', 40, 40],
            body: [['CONCEPTOS', 'MES', 'S.TOTAL'], ...dataPagos],
          },
        },
        {
          text: `SON: ${montoPagado} con 00/100 SOLES`,
          alignment: 'left',
          style: 'small',
          margin: [0, 8],
        },
        {
          text: `
            SUBTOTAL: \t\t S/ ${montoPagado}.00 \n
            TASAS: \t\t S/ 0.00 \n
            DESCUENTO: \t\t S/ 0.00 \n
            ________________________ \n
          `,
          alignment: 'right',
          style: 'small',
          margin: [0, 8],
        },
        {
          text: `TOTAL A PAGAR: \t\t S/ ${montoPagado}.00`,
          alignment: 'right',
          style: 'subheader',
          margin: [0, 8],
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
        },
        quote: {
          italics: true,
        },
        small: {
          fontSize: 8,
        },
        tableExample: {
          fontSize: 8,
          margin: [0, 0, 0, 0],
        },
      },
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  private getBase64ImageFromURL(url:any) {
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

    getMes(mes: any | undefined = 0): String{
      if (typeof(mes) !== "string"){
        let mesNombre:string = moment().month(Number(mes)-1).format('MMMM');
        return mesNombre;
      }
      return mes;
    }

    getNombreCompleto(): String{
      return `${this.cliente.nombres} ${this.cliente.apepaterno} ${this.cliente.apematerno}`;
    }
}
