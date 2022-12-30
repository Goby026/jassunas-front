import { Usuario } from './usuario.model';

export class Caja {
  constructor(
    public ncaja: string,
    public efectivoape: number,
    public fapertura: Date | string,
    public fcierre: Date | string,
    public total: number,
    public esta: number,
    public idcaja?: number,
    public usuario?: Usuario,
    public created_at?: Date,
    public updated_at?: Date
  ) {}
}
