import { Servicio } from "./servicio.model";

export class Tarifario{
  constructor(
    public servicio: Servicio,
    public detalletarifario: string | null,
    public monto: number | null,
    public esta: number | null,
    public idtarifario?: number,
    public created_at?: number,
    public updated_at?: number,
  ){}
}

