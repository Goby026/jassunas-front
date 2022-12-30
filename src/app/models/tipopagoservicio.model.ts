export class TipoPagoServicio {
  constructor(
    public descripcion: string | null,
    public idtipopagosservicio?: number, //PK
    public created_at?: Date | string,
    public updated_at?: Date | string
  ) {}
}
