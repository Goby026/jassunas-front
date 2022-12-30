import { Cliente } from "./cliente.model";
import { DeudaDescripcion } from "./deudadescripcion.model";
import { DeudaEstado } from "./deudaestado.model";

export class Deuda{
  constructor(
    public codigo: string | null,
    public periodo: Date | string,
    public total: number,
    public saldo: number,
    public vencimiento: Date,
    public estado: number,
    public cliente: Cliente,
    public deudaDescripcion: DeudaDescripcion,
    public deudaEstado: DeudaEstado,
    public created_at?: Date,
    public updated_at?: Date,
    public idtbdeudas?: number//PK
  ){}
}
