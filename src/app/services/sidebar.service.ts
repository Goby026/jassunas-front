import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Principal',
      icono: 'menu-icon tf-icons bx bx-money',
      submenu: [
        { titulo: 'Main', url: '/dashboard'},
        { titulo: 'Cobranzas', url: 'cobranzas'},
        { titulo: 'Zonas', url: 'zonas'},
      ]
    }
  ];

  constructor() { }
}
