export class DeudaEstado{
  constructor(
    public estado: string,
    public valor: string,
    public iddeudaEstado?: number,
    public created_at?: Date,
    public updated_at?: Date,
  ){}
}
