import { Costo } from "./costo.model";
import { Tarifario } from "./tarifario.model";

export class CostoOtroServicio{
  constructor(
    public id: number,
    public costo: Costo,
    public tarifario: Tarifario,
    public created_at: number,
    public updated_at: number,
  ){}
}


