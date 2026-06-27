import { randomUUID } from "crypto";

export const generateUUID = (prefix?: string) => {
  const id = randomUUID();
  return prefix ? `${prefix}_${id}` : id;
};