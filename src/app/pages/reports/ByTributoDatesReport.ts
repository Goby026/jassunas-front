import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TributoDetalle } from 'src/app/models/tributoDetalle.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export class ByTributoDatesReport {
  constructor(
    public titulo: string,
    // public total: number,
    public fechaInicio: string,
    public fechaFin: string,
    // public monto: number,
    public detalles: TributoDetalle[]
  ) {}

  public async reporte() {
    let recordDetalles: any[] = [];
    let fecha = moment().format('MM-DD-YYYY');
    let inicio = moment(this.fechaInicio).format('MM-DD-YYYY');
    let fin = moment(this.fechaFin).format('MM-DD-YYYY');
    let hora = moment().format('HH:mm');
    let total = 0;

    this.detalles.map((item: TributoDetalle) => {
      let arrItem: any = [
        item.id || 0,
        `${item.cliente.apepaterno} ${item.cliente.apematerno} ${item.cliente.nombres}`,
        `${item.direccion}`,
        moment(item.createdAt).format('DD-MM-YYYY'),
        `S/ ${item.monto}.00`
      ];
      recordDetalles.push(arrItem);
      total += 1;
    });

    // crear pdf
    const pdfDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [ 20, 30, 20, 30 ],
      content: [
        { text: this.titulo, style: 'subheader' },
        {
          bold: true,
          ul: [`Fecha: ${fecha}`,`Hora: ${hora}`, 'JASS-UÑAS'],
        },
        {
          bold: false,
          ul: [`Desde: ${inicio} Hasta: ${fin}`],
        },
        {
          style: 'tableExample',
          table: {
            widths: [20, '*', 100, 50,50],
            body: [
              ['#', 'Cliente', 'Dirección', 'Fecha','Monto'],
              ...recordDetalles,
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', 50,50],
            body: [
              [
                '************',
                '#CANT:',
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
                `Sistema de gestión de pagos de la Junta Administradora de Agua Potable de Uñas - Hyo ${moment().year()}`,
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
          fontSize: 16,
          bold: true,
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
