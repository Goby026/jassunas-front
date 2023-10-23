import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-descuentos',
  templateUrl: './descuentos.component.html',
})
export class DescuentosComponent implements OnInit {
  @Output() dcto = new EventEmitter<any>();

  miDcto: number = 0.0;
  miObs: string = '';

  constructor() {}

  ngOnInit(): void {}

  aplicarDcto() {
    this.dcto.emit({ descuento: this.miDcto, mensaje: this.miObs });
    this.resetData();
  }

  resetData() {
    this.miDcto = 0.0;
    this.miObs = '';
  }
}
