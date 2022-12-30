import { Deuda } from "./deuda.model";

export class Condonacion{
  constructor(
    public estado: number,
    public fecha: Date,
    public monto: number,
    public observacion: string,
    public usuario: string,
    public deuda: Deuda,
    public idcondonacion?: number,
    public created_at?: Date,
    public updated_at?: Date,
  ){}
}
