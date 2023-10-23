// import { ItemHistorial } from 'src/app/interfaces/items-historial-interface';
import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Deuda } from 'src/app/models/deuda.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export class MultasReport{

    constructor(
        public multas: Deuda[]
    ){}

    public async reporte(){

        let historialPagos: any[] = [];

        this.multas.map( (item: Deuda)=>{
          let arrItem: any = [item.deudaDescripcion.descripcion, `${item.cliente.apepaterno} ${item.cliente.apematerno} ${item.cliente.nombres}`, item.deudaEstado.estado, `S/ ${item.saldo}.00`];

          historialPagos.push(arrItem);
        });
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
              text: `REPORTE DE MULTAS`,
              style: 'header'
            },
            `${moment().format('MMMM Do YYYY, h:mm:ss a')}.\n\n`,
            {
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: ['auto','auto','auto', 50],

                body: [
                  ['TIPO MULTA', 'CLIENTE', 'ESTADO', 'MONTO'],
                  ...historialPagos
                ]
              }
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

