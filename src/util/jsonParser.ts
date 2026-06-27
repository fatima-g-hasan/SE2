import fs from "fs";

export function readJSONFile<T>(filePath: string): T {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    return data as T;
  } catch (error) {
    throw new Error(`Error reading JSON file: ${(error as Error).message}`);
  }
}

export function writeJSONFile<T>(filePath: string, data: T): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString);
  } catch (error) {
    throw new Error(`Error writing JSON file: ${(error as Error).message}`);
  }
}