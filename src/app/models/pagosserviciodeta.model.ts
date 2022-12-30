import { Cliente } from "./cliente.model";
import { PagosServicio } from "./pagosservicio.model";

export class PagosServicioDetalle {
  constructor(
    public idmes: number,
    public detalletasas: string,
    public idanno: number,
    public monto: number,
    public cliente: Cliente,
    public pagosServicio: PagosServicio,
    public idcabecera?: number | null,
    public iddetalle?: number, //PK
    public created_at?: Date | string,
    public updated_at?: Date | string
  ) {}
}
