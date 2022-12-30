export class Role{
  constructor(
    public authority: string,
    public id?: number,
    public created_at?: Date,
    public updated_at?: Date,
  ){}
}
