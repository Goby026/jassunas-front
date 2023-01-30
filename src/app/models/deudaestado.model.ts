export class DeudaEstado{
  constructor(
    public estado: string | null,
    public valor: string | null,
    public iddeudaEstado?: number,
    public created_at?: Date,
    public updated_at?: Date,
  ){}
}
