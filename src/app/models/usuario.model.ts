import { Role } from "./role.model";

export class Usuario{
  constructor(
    public username: string,
    public email: string,
    public password?: string,
    public enabled?: boolean,
    public img?: string,
    public roles?: Role[] | undefined,
    public id?: number,
  ){}
}
