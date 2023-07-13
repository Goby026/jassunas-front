import { Caja } from "./caja.model";
import { Cliente } from "./cliente.model";
import { Costo } from "./costo.model";
import { Deuda } from "./deuda.model";
import { PagoServicioEstado } from "./pagoservicioestado.model";
import { TipoPagoServicio } from "./tipopagoservicio.model";
import { Usuario } from "./usuario.model";

export class PagosServicio{
    constructor(
      public costo: Costo,
      public cliente: Cliente,
      public montoapagar: number,
      public montotasas: number,
      public montodescuento: number,
      public montopagado: number,
      public fecha: Date | string,
      public usuario: Usuario | null,
      public esta: number,
      public correlativo: number | null,
      public caja: Caja,
      public pagoServicioEstado: PagoServicioEstado,
      public tipoPagoServicios: TipoPagoServicio,
      public deuda?: Deuda | null, //PK
      public id?: number, //PK
      public observacion?: string | null,
      public created_at?: Date | string,
      public updated_at?: Date | string,
    ){}
}
