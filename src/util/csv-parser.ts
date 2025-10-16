import { promises as fs } from 'fs';
import { parse as csvParse } from 'csv-parse';
import { stringify as csvStringify } from 'csv-stringify';


export async function readCSVFile(filePath: string, includeHeader: boolean = false): Promise<string[][]> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return new Promise ((resolve, reject) => {
      csvParse(fileContent, {
        trim: true,
        skip_empty_lines: true
      }, (err, records: string[][]) => {
        if (err) reject (err);
        if (!includeHeader) records.shift();
        resolve(records);
      });
    });
  } catch (error) {
    throw new Error(`Error reading CSV file: ${error}`);
  }
}

export async function writeCSVFile(filePath: string, data: string[][]): Promise<void> {
  try {
    const csvContent = await new Promise<string>((resolve, reject) => {
      csvStringify(data, (err, output) => {
        if (err) reject (err);
        resolve(output);
      });
    });
    await fs.writeFile(filePath, csvContent, 'utf-8');
  } catch (error) {
    throw new Error(`Error writing CSV file: ${error}`);
  }
}

