export class PagoServicioEstado{
  constructor(
    public descripcion:string | null,
    public idpagoestado?:number,
    public created_at?:Date | string,
    public updated_at?:Date | string,
  ){}
}
