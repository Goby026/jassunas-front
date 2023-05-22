import { Injectable } from '@angular/core';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  logoPath: string  ='../../../assets/img/jass.png';

  menu: any[] = [
    {
      titulo: 'Principal',
      icono: 'menu-icon tf-icons bx bx-home-circle',
      path: '/dashboard',
      roles: ['ADMIN_ROLE','USER_ROLE','CAJA_ROLE','SECRETARIA_ROLE']
      // submenu: [
      //   { titulo: 'Main', url: '/dashboard'},
      //   { titulo: 'Cobranzas', url: 'cobranzas'},
      //   { titulo: 'Zonas', url: 'zonas'},
      // ]
    },
    {
      titulo: 'Caja',
      icono: 'menu-icon tf-icons bx bxs-bank',
      path: 'caja',
      roles: ['ADMIN_ROLE','CAJA_ROLE']
    },
    {
      titulo: 'Egresos',
      icono: 'menu-icon tf-icons bx bx-wallet',
      path: 'egresos',
      roles: ['ADMIN_ROLE','CAJA_ROLE']
    },
    {
      titulo: 'Cobranzas',
      icono: 'menu-icon tf-icons bx bx-money',
      path: 'cobranzas',
      roles: ['ADMIN_ROLE','CAJA_ROLE']
    },
    {
      titulo: 'Vouchers',
      icono: 'menu-icon tf-icons bx bx-credit-card',
      path: 'vouchers',
      roles: ['ADMIN_ROLE','CAJA_ROLE']
    },
    {
      titulo: 'Clientes',
      icono: 'menu-icon tf-icons bx bx-user',
      path: 'clientes',
      roles: ['ADMIN_ROLE']
    },
    {
      titulo: 'Reportes',
      icono: 'menu-icon tf-icons bx bxs-report',
      path: 'reportes',
      roles: ['ADMIN_ROLE','USER_ROLE','CAJA_ROLE','SECRETARIA_ROLE']
    },
  ];

  constructor() {
  }

  filtrarAccesos(rol: string): any[]{

    const newMenu: any[] = [];

    this.menu.forEach( (item)=>{
      if (item.roles.includes(rol)) {
        newMenu.push(item);
      }
    });

    return newMenu;
  }
}
