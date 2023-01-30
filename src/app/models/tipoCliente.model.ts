export class TipoCliente {
  constructor(
    public descripcion:string | null,
    public created_at?:string,
    public updated_at?:string,
    public idtipocliente?:number,
  ) {}
}
