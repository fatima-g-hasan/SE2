import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export enum DBMode {
  SQLITE,
  FILE,
  POSTGRES
}

export interface TokenPayload extends JwtPayload  {
  userId: string;
}

export interface AuthRequest extends Request {
  userId: string;
}