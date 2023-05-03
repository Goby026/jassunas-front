import { Cliente } from "./cliente.model";
import { Requisito } from "./requisito.model";
import { Tributo } from "./tributo.model";

export class TributoDetalle {
  constructor(
    public datosclientes:string,
    public direccion:string,
    public monto:number,
    public usuaCrea:string,
    public fecha:Date | string,
    public esta:number,
    public correlativo:number,
    public idanno:number,
    public cliente:Cliente,
    public requisito:Requisito,
    public tributo:Tributo,
    public id?:number, //PK
    public createdAt?:Date | string,
    public updated_at?:Date | string,
  ) {}
}
