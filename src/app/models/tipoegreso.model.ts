export class TipoEgreso{
  constructor(
    public descripcion: string,
    public estado: number,
    public idtipoegreso?: number | string,
  ){}
}
