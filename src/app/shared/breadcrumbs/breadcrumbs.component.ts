import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  public titulo!: string;

  constructor( private router: Router ) {
    this.argumentosRuta();
  }

  ngOnInit(): void {
  }

  argumentosRuta(){
    this.router.events
    .pipe(
      filter((event): event is ActivationEnd => event instanceof ActivationEnd),
      filter((event:ActivationEnd) => event.snapshot.firstChild === null),
      map((event:ActivationEnd) => event.snapshot.data)
    )
    .subscribe( (data:any) => {
      this.titulo = data.titulo,
      document.title = `Jassuñas - ${data.titulo}`;
    });
  }

}
