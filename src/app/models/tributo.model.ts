import { Cliente } from "./cliente.model";
import { Usuario } from "./usuario.model";

export class Tributo {
  constructor(
    public usuario:string,
    public dettupa:string,
    public detrequisito:string,
    public subtotal:number,
    public correlativo:number | null,
    public cliente:Cliente,
    public user: Usuario,
    public iddetatributo?:number, //PK
    public created_at?: Date | string,
    public updated_at?: Date | string,
  ) {}
}
