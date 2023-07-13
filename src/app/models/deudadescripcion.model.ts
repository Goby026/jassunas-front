export class DeudaDescripcion {
  constructor(
    public descripcion: string,
    public estado?: number,
    public iddeudadescripcion?: number,
    public created_at?: Date,
    public updated_at?: Date,
  ){}
}
