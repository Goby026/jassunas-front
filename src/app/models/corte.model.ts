import { Usuario } from './usuario.model';

export class Corte {
  constructor(
    public deuda: number,
    public pagado: number,
    public totalcobrar: number,
    public usuario: Usuario,
    public idcorte?: number,
    public createdAt?: Date | string,
    public updatedAt?: Date | string
  ) {}
}
