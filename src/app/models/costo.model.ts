import { Cliente } from "./cliente.model";
import { Servicio } from "./servicio.model";
import { Zona } from "./zona.model";

export class Costo{
  constructor(
    public servicio:Servicio,
    public zona:Zona,
    public cliente: Cliente,
    public mza:string,
    public lote:string,
    public nropre:string,
    public fecha_registro:Date | string,
    public fecha_inicio_servicio:Date | string,
    public fcobranza:Date | string,
    public esta:number,
    public suministro:string,
    public kw:string,
    public exof:boolean | string,
    public exoa:boolean | string,
    public exop:boolean | string,
    public tpousuario:string | null,
    public tpovivienda:string,
    public nrointegrante:number,
    public referencia_dom:string,
    public created_at?:Date,
    public updated_at?:Date,
    public codcosto?: number,
  ){}
}
