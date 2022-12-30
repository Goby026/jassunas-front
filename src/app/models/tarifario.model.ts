import { Servicio } from "./servicio.model";

export class Tarifario{
  constructor(
    public servicio: Servicio,
    public detalletarifario: string,
    public monto: number,
    public esta: number,
    public idtarifario?: number,
    public created_at?: number,
    public updated_at?: number,
  ){}
}

