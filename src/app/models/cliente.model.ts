import { TipoCliente } from "./tipoCliente.model";
import { Zona } from "./zona.model";

export class Cliente {
  constructor(
    public dni: string,
    public nombres: string,
    public apepaterno: string,
    public apematerno: string,
    public direccion: string,
    public fec_nac: Date,
    public num_instalaciones: number,
    public num_familias: number,
    public exo_p: boolean,
    public exo_a: boolean,
    public exo_f: boolean,
    public fec_ing: Date,
    public baja: string,
    public fec_baja: Date,
    public tipoCliente: TipoCliente,
    public zona: Zona,
    public estado: string | number,
    public codCli: string,
    public costo?: number | 0,
    public created_at?: Date,
    public updated_at?: Date,
    public idclientes?: number | string
  ) {}


  getNombreCompleto?():string{
    return `${this.apepaterno} ${this.apematerno} ${this.nombres}`;
  }
}

// {
//   public ape_paterno: string,
//     public ape_materno: string,
//     public nombres: string,
//     public direccion: string,
//     public zona: string,
//     public tipoCliente: string,
//     public num_familias: string,
//     public num_instalaciones: string,
// }
