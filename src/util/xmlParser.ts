import fs from "fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

/**
 * Generic XML reader
 */
export function readXMLFile<T>(filePath: string): T {
  try {
    const xmlData = fs.readFileSync(filePath, "utf-8");

    const parser = new XMLParser({
      ignoreAttributes: false,
    });

    const result = parser.parse(xmlData);

    return result as T;
  } catch (error) {
    throw new Error(
      `Error reading XML file: ${(error as Error).message}`
    );
  }
}

/**
 * Generic XML writer
 */
export function writeXMLFile<T>(filePath: string, data: T): void {
  try {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data provided for XML writing");
    }

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
    });

    const xmlString = builder.build(data);

    fs.writeFileSync(filePath, xmlString, "utf-8");
  } catch (error) {
    throw new Error(
      `Error writing XML file: ${(error as Error).message}`
    );
  }
}