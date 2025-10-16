import fs from "fs";

export function readJSONFile(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    return data;
  } catch (error) {
    throw new Error(`Error reading JSON file: ${(error as Error).message}`);
  }
}

export function writeJSONFile(filePath: string, data: any): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString);
  } catch (error) {
    throw new Error(`Error writing JSON file: ${(error as Error).message}`);
  }
}
