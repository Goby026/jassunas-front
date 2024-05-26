import { Usuario } from "./usuario.model";

export class Corte {
  constructor(
    public idcorte: number,
    public deuda: number,
    public pagado: number,
    public totalcobrar: number,
    public usuario: Usuario,
    public created_at?: Date,
    public updated_at?: Date
  ){}
}
