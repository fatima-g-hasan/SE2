import fs from "fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";


export function readXMLFile(filePath: string): any {
  try {
    const xmlData = fs.readFileSync(filePath, "utf-8");
    const parser = new XMLParser({ ignoreAttributes: false });
    const result = parser.parse(xmlData);
    return result;
  } catch (error) {
    throw new Error(`Error reading XML file: ${(error as Error).message}`);
  }
}

export function writeXMLFile(filePath: string, data: any): void {
  try {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data");
    }
    const builder = new XMLBuilder({ ignoreAttributes: false, format: true });
    const xmlString = builder.build(data);
    fs.writeFileSync(filePath, xmlString);
  } catch (error) {
    throw new Error(`Error writing XML file: ${(error as Error).message}`);
  }
}
