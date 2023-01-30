import { ItemHistorial } from 'src/app/interfaces/items-historial-interface';
import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export class Historial{

    constructor(
        // public correlativo: number | null,
        // public idCliente: number,
        public nombre_completo: string,
        // public direccion: string,
        // public monto: number,
        public pagos: PagosServicioDetalle[]
    ){}

    public async reporte(){

        let historialPagos: any[] = [];

        this.pagos.map( (item:PagosServicioDetalle)=>{
          let arrItem: any = [item.iddetalle || 0, moment(item.created_at).format('DD-MM-YYYY'), item.detalletasas, item.pagosServicio.correlativo, `S/ ${item.monto}`, item.pagosServicio.esta];
          historialPagos.push(arrItem);
        } );
        // crear pdf
        const pdfDefinition: any = {
          // pageSize: 'A4',
          // pageOrientation: 'landscape',
          // pageMargins: [ 20, 30, 20, 30 ],
          content: [
            {
              // image: await this.getBase64ImageFromURL('../../../assets/img/jass.png'),
              image: await this.getBase64ImageFromURL('../../../../assets/img/jass.png'),
              width: 90,
              alignment: 'left',
              margin: [0,0,0,20]
            },
            {
              text: `HISTORIAL DE PAGOS DE - ${this.nombre_completo}`,
              style: 'header'
            },
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n',
            {
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ 50, 'auto','auto','auto', 50, '*' ],

                body: [
                  [ '#', 'CREACION', 'CONCEPTO', 'BOLETA', 'MONTO', 'ESTADO' ],
                  ...historialPagos
                ]
              }
            }
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
}

