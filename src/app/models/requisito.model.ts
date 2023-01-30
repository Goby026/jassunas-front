import { Tupa } from "./tupa.model";

export class Requisito{
  constructor(
    public tupa:Tupa,
    public requisitos:string,
    public monto_ref:number,
    public partida:string,
    public codrequi?:number, //PK
    public created_at?:Date | string,
    public updated_at?:Date | string,
  ){}
}

