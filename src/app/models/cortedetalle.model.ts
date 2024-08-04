import { Cliente } from './cliente.model';
import { Corte } from './corte.model';

export class CorteDetalle {
  constructor(
    public cliente: Cliente,
    public codigo: String,
    public periodo: Date | String,
    public total: number,
    public saldo: number,
    public dcto: number,
    public vencimiento: Date | String,
    public estado: number,
    public corte: Corte,
    public idcortedetalle?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
