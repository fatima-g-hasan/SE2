import { ROLE } from "../config/roles";
import { id, ID } from "../repository/IRepository";

export class User implements ID {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;

  constructor(name: string, email: string, password: string, id: string = '', role: ROLE = ROLE.user) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  getId(): id {
    return this.id;
  }
}