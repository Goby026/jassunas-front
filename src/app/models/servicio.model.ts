export class Servicio{
  constructor(
    public detaservicios: string | null,
    public estado: number | null,
    public created_at?: Date | string,
    public updated_at?: Date | string,
    public codservi?: number,
  ){}
}
