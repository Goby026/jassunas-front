import { PagosServicio } from "./pagosservicio.model";
import { Voucher } from "./voucher.model";

export class VoucherDetalle{
  constructor(
    public detalletasas:string,
    public periodo:Date | string,
    public idmes:number,
    public idanno:number,
    public monto:number,
    public voucher:Voucher | null,
    public pagosServicio:PagosServicio | null,
    public idvoucherdetalles?:number | string, //pk
    public created_at?:Date | string,
    public updated_at?:Date | string,
  ){}
}
