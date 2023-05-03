import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Cliente } from 'src/app/models/cliente.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export class ByZonaReport {
  constructor(
    public titulo: string,
    public subtitulo: string,
    // public fechaFin: string,
    // public monto: number,
    public clientes: Cliente[]
  ) {}

  public async reporte() {
    let recordClientes: any[] = [];
    let fecha = moment().format('MM-DD-YYYY');
    let hora = moment().format('HH:mm');
    let total: number = 0;

    this.clientes.map((item: Cliente) => {
      let arrItem: any = [
        item.idclientes || 0,
        `${item.apepaterno} ${item.apematerno} ${item.nombres}`,
        `${item.direccion}`,
        `${item.zona.detazona}`,
        `${item.estado}`
      ];
      recordClientes.push(arrItem);
      total += 1;
    });

    // crear pdf
    const pdfDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [ 20, 30, 20, 30 ],
      content: [
        { text: this.titulo, style: 'header' },
        { text: this.subtitulo, style: 'subheader' },
        {
          bold: true,
          ul: [`Fecha: ${fecha}`,`Hora: ${hora}`, 'JASS-UÑAS'],
        },
        {
          style: 'tableExample',
          table: {
            widths: [20, '*', 50, 50,50,60],
            body: [
              ['#', 'Cliente', 'Dirección', 'Zona', 'Estado'],
              ...recordClientes,
              // [
              //   {
              //     text: `Total: ${this.total}`,
              //     italics: true,
              //     color: 'gray',
              //   },
              // ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', 50,60],
            body: [
              [
                '***',
                'TOTAL:',
                `${total}`
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              [
                'Sistema de gestión de pagos de la Junta Administradora de Agua Potable de Uñas',
              ],
            ],
          },
        },
        {
          image: await this.getBase64ImageFromURL(
            '../../../assets/img/jass.png'
          ),
          width: 90,
          alignment: 'center',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: false,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          fontSize: 9,
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  private getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx: any = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }
}
