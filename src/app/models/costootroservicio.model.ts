import { Costo } from "./costo.model";
import { Tarifario } from "./tarifario.model";

export class CostoOtroServicio{
  constructor(
    public costo: Costo,
    public tarifario: Tarifario,
    public id?: number,
    public created_at?: Date | string,
    public updated_at?: Date | string,
  ){}
}


