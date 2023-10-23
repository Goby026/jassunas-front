import { Cliente } from "./cliente.model";
import { PagosServicio } from "./pagosservicio.model";

export class PagosServicioDetalle {
  constructor(
    public idmes: number | undefined,
    public detalletasas: string,
    public idanno: number,
    public monto: number | null,
    public cliente: Cliente,
    public pagosServicio: PagosServicio,
    public iddeuda? : number | null,
    public idcabecera?: number | null,
    public id?: number, //PK
    public state?: number, //PK
    public created_at?: Date | string,
    public updated_at?: Date | string
  ) {}
}
