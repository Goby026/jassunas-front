export class Tupa {
  constructor(
    public codti_tri:number,
    public denominacion:string,
    public partida:string,
    public fecha_aprobacion:Date | string,
    public esta:number,
    public codtupa?:number, //PK
    public created_at?:Date | string,
    public updated_at?:Date | string,
  ) {}
}
