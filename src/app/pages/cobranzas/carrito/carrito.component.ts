import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';


import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DeudaService } from 'src/app/services/deuda.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  @Input() deudas: any[] = [];
  @Input() idCliente: number = 0;
  @Input() prop: number = 0;

  monto: number = 0;

  constructor( private deudaService: DeudaService ) { }

  ngOnInit(): void {
    // this.listarPreDeudas();
  }

  ngOnChanges(changes: SimpleChanges){
    // console.log('Deuda----->', this.deudas);
    this.listarPreDeudas();
  }

  listarPreDeudas(){
    this.monto = 0;
    let cliente: any = {
      "idclientes": this.idCliente
    };
    this.deudaService.getUserPreDebt(cliente)
    .subscribe({
      next: ( resp:any )=>{
        // this.deudas = resp;
        console.log(resp);
      },
      error: error=>console.log(error)
    });
  }

  btnPagar(){
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
