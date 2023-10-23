import { Cliente } from "./cliente.model";
import { DeudaDescripcion } from "./deudadescripcion.model";
import { DeudaEstado } from "./deudaestado.model";

export class Deuda{
  constructor(
    public codigo: string | null,
    public periodo: Date | string,
    public total: number,
    public saldo: number,
    public vencimiento: Date | string,
    public estado: number,
    public cliente: Cliente,
    public deudaDescripcion: DeudaDescripcion,//tipo de deuda
    public deudaEstado: DeudaEstado,
    public dcto: number | 0,
    public observacion?: string | null,
    public created_at?: Date,
    public updated_at?: Date,
    public idtbdeudas?: number//PK
  ){}
}
