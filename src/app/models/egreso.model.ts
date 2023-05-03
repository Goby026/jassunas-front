import { Caja } from "./caja.model";
import { TipoEgreso } from "./tipoegreso.model";
import { Usuario } from "./usuario.model";

export class Egreso{
  constructor(
    public nregistro:string,
    public fecha:string,
    public documento:string,
    public nombrerazon:string,
    public detalle:string,
    public importe:number | string,
    public estado:number | null,
    public caja:Caja,
    public tipoEgreso:TipoEgreso,
    public usuario:Usuario | null,
    public idegreso?:number | string,
  ){
  }
}
