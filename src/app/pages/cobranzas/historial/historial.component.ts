import { Component, OnInit } from '@angular/core';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  crearPdf(){
    const pdfDefinition: any = {
      pageSize: {
        width: 350,
        height: 'auto'
      },
      content: [
        {
          text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas voluptas autem voluptatum totam sint molestiae tempora alias eum iusto aut architecto hic, voluptatem vel, quos sit consequatur dolor ipsum dicta accusamus nisi minima. Laudantium accusamus vel temporibus adipisci, aut deleniti nisi quas minus, aspernatur illo impedit cum, ipsa ea soluta.- Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas voluptas autem voluptatum totam sint molestiae tempora alias eum iusto aut architecto hic, voluptatem vel, quos sit consequatur dolor ipsum dicta accusamus nisi minima. Laudantium accusamus vel temporibus adipisci, aut deleniti nisi quas minus, aspernatur illo impedit cum, ipsa ea soluta. -- Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas voluptas autem voluptatum totam sint molestiae tempora alias eum iusto aut architecto hic, voluptatem vel, quos sit consequatur dolor ipsum dicta accusamus nisi minima. Laudantium accusamus vel temporibus adipisci, aut deleniti nisi quas minus, aspernatur illo impedit cum, ipsa ea soluta.'
        }
      ]
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

}
