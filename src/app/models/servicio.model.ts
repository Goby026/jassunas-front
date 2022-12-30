export class Servicio{
  constructor(
    public detaservicios: string,
    public estado: number,
    public created_at?: Date | string,
    public updated_at?: Date | string,
    public codservi?: number,
  ){}
}
