import { Cliente } from "./cliente.model";
import { PagoServicioEstado } from "./pagoservicioestado.model";
import { PagosServicio } from "./pagosservicio.model";
import { TipoPagoServicio } from "./tipopagoservicio.model";

export class Voucher{
  constructor(
    public cliente:Cliente,
    public montoapagar:number,
    public montotasas:number,
    public montodescuento:number,
    public montopagado:number,
    public fecha:Date | null,
    public usuaCrea:string,
    public imagen:string,
    public correlativo:number,
    public pagoServicioEstado:PagoServicioEstado,
    public tipoPagoServicios:TipoPagoServicio,
    public idvoucher?:number, //PK
    public created_at?:string,
    public updated_at?:string,
  ){}
}
