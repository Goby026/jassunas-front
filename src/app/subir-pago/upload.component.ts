import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Cliente } from '../models/cliente.model';
import { Voucher } from '../models/voucher.model';
import { VoucherService } from '../services/voucher.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html'
})
export class UploadComponent implements OnInit {

  private imgSelected!: File;
  voucherS!: Voucher;
  cliente!: Cliente;

  nombreCompleto: string = '';

  constructor(
      private voucherService: VoucherService,
      private activatedRoute: ActivatedRoute,
      private router: Router ) { }

  ngOnInit(): void {
    this.setParametros();

  }

  setParametros() {
    this.activatedRoute.params.subscribe({
      next: (params:any) => {
        let {voucher} = JSON.parse(params.voucher);
        this.cliente = voucher.cliente;
        this.voucherS = voucher;
      },
      error: (error) => console.log(error),
      complete: () => {
        console.log('finalizado');
      },
    });

    this.nombreCompleto = `${this.cliente.apepaterno} ${this.cliente.apematerno} ${this.cliente.nombres}`;
  }

  selImagen(e:any){
    this.imgSelected = e.target.files[0];
  }

  subirImagen(){
    if(this.imgSelected === null || this.imgSelected === undefined || this.imgSelected.size <= 0){
      alert('Seleccionar una imagen');
      return;
    }

    if(!confirm('¿Enviar imagen seleccionada?')){
      return;
    }

    this.voucherService.uploadFile(this.imgSelected, this.voucherS.idvoucher)
    .subscribe({
      next: (res:Voucher) => {
        this.voucherS = res;
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        alert('Se subió la imagen correctamente');
        this.router.navigate(['/subir-pago']);
      }
    });
  }

}
