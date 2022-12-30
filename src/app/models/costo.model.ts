import { Cliente } from "./cliente.model";
import { Servicio } from "./servicio.model";
import { TipoCliente } from "./tipoCliente.model";
import { Zona } from "./zona.model";

export class Costo{
  constructor(
    public servicio:Servicio,
    public zona:Zona,
    public cliente: Cliente,
    public mza:string,
    public lote:string,
    public nropre:string,
    public fecha_registro:Date,
    public fecha_inicio_servicio:Date,
    public fcobranza:Date,
    public esta:number,
    public suministro:string,
    public kw:string,
    public exof:boolean,
    public exoa:boolean,
    public exop:boolean,
    public tpousuario:string,
    public tpovivienda:string,
    public nrointegrante:number,
    public referencia_dom:string,
    public created_at?:Date,
    public updated_at?:Date,
    public codcosto?: number,
  ){}
}
