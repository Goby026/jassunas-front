import { Usuario } from './usuario.model';

export class Ingreso {
  constructor(
    public inicio:string,
    public fin:string,
    public usuario:Usuario,
    public idingreso?:string,
    public createdAt?:string,
    public updatedAt?:string,
  ) {}
}
