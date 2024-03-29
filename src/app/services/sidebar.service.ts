import { Injectable } from '@angular/core';
// import { Role } from '../models/role.model';

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
      roles: ['MASTER_ROLE','ADMIN_ROLE','USER_ROLE','CAJA_ROLE','SECRETARIA_ROLE']
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
      roles: ['MASTER_ROLE','ADMIN_ROLE','CAJA_ROLE']
    },
    {
      titulo: 'Egresos',
      icono: 'menu-icon tf-icons bx bx-wallet',
      path: 'egresos',
      roles: ['MASTER_ROLE','ADMIN_ROLE','CAJA_ROLE']
    },
    {
      titulo: 'Cobranzas',
      icono: 'menu-icon tf-icons bx bx-money',
      path: 'cobranzas',
      roles: ['MASTER_ROLE','ADMIN_ROLE','CAJA_ROLE']
    },
    // {
    //   titulo: 'Multas',
    //   icono: 'menu-icon tf-icons bx bx-money',
    //   path: 'multas',
    //   roles: ['ADMIN_ROLE','CAJA_ROLE']
    // },
    {
      titulo: 'Vouchers',
      icono: 'menu-icon tf-icons bx bx-credit-card',
      path: 'vouchers',
      roles: ['MASTER_ROLE','ADMIN_ROLE','CAJA_ROLE']
    },
    {
      titulo: 'Socios',
      icono: 'menu-icon tf-icons bx bx-user',
      path: 'clientes',
      roles: ['MASTER_ROLE','ADMIN_ROLE','CAJA_ROLE','SECRETARIA_ROLE']
    },
    {
      titulo: 'Reportes',
      icono: 'menu-icon tf-icons bx bxs-report',
      path: 'reportes',
      roles: ['MASTER_ROLE','ADMIN_ROLE','USER_ROLE','CAJA_ROLE','SECRETARIA_ROLE']
    },
    {
      titulo: 'Contable',
      icono: 'menu-icon tf-icons bx bx-calculator',
      path: 'contable',
      roles: ['MASTER_ROLE','ADMIN_ROLE','USER_ROLE','CAJA_ROLE','SECRETARIA_ROLE']
      // submenu: [
      //   { titulo: 'Main', url: '/dashboard'},
      //   { titulo: 'Cobranzas', url: 'cobranzas'},
      //   { titulo: 'Zonas', url: 'zonas'},
      // ]
    },
    {
      titulo: 'Accesos',
      icono: 'menu-icon tf-icons bx bx-door-open',
      path: 'accesos',
      roles: ['MASTER_ROLE','ADMIN_ROLE','USER_ROLE']
    },
    {
      titulo: 'Administrador',
      icono: 'menu-icon tf-icons bx bx-cog',
      path: 'administrador',
      roles: ['MASTER_ROLE','USER_ROLE','CAJA_ROLE','SECRETARIA_ROLE',]
      // submenu: [
      //   { titulo: 'Main', url: '/dashboard'},
      //   { titulo: 'Cobranzas', url: 'cobranzas'},
      //   { titulo: 'Zonas', url: 'zonas'},
      // ]
    }
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
