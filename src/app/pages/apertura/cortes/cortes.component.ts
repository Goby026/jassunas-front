
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Corte } from 'src/app/models/corte.model';
import { CorteService } from 'src/app/services/corte.service';

@Component({
  selector: 'app-cortes',
  templateUrl: './cortes.component.html'
})
export class CortesComponent implements OnInit {

  constructor( private corteService: CorteService, private router: Router ) { }

  ngOnInit(): void {
    this.corteService.getCortes()
    .subscribe({
      next: (resp: Corte[]) => {
        console.log(resp);
      },
      error: (error) => console.log(error),
      complete: () => {},
    });
  }


  generateViewDebts(){
    //evaluar mes, sino hay registro del mes entonces continuar
    this.router.navigate(['/dashboard/caja/cortes/detallecorte']);
  }

}
