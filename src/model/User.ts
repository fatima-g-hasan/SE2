import { id, ID } from "../repository/IRepository";

export class User implements ID {
  id: string;
  name: string;
  email: string;
  password: string;

  constructor(name: string, email: string, password: string, id: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  getId(): id {
    return this.id;
  }
}