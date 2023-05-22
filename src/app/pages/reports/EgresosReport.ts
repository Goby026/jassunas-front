import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Egreso } from 'src/app/models/egreso.model';
import { TipoEgreso } from 'src/app/models/tipoegreso.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export class EgresosReport {
  constructor(
    public titulo: string,
    public egresos: Egreso[],
    // public tipos: TipoEgreso[],
  ) {}

  public async reporte() {
    let historialPagos: any[] = [];
    let total: number = 0;
    let fecha = moment().format('MM-DD-YYYY');
    let hora = moment().format('HH:mm');

    this.egresos.map((item: Egreso) => {
      let arrItem: any = [
        item.tipoEgreso.descripcion,
        item.nregistro || 0,
        `${item.fecha}`,
        `${item.documento}`,
        `${item.nombrerazon}`,
        `${item.detalle}`,
        `S/ ${item.importe}.00`
      ];

      total += Number(item.importe);

      historialPagos.push(arrItem);
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
          style: 'tableExample',
          table: {
            widths: ['*',50, 90, 50,'*', '*', '*',50],
            body: [
              ['Categoría','N° Reg.', 'Fecha', 'Documento', 'Nombre/Razon Social','Detalle', 'Importe'],
              ...historialPagos,
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
            widths: ['*', 50,50],
            body: [
              [
                '***',
                'TOTAL:',
                `S/ ${total}`
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
