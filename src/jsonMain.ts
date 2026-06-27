import { readJSONFile } from "./util/jsonParser";
import logger from "./util/logger";

export interface BookOrderRecord {
  "Order ID": string;
  "Book Title": string;
  Author: string;
  Genre: string;
  Format: string;
  Language: string;
  Publisher: string;
  "Special Edition": string;
  Packaging: string;
  Price: string;
  Quantity: string;
}


async function main() {
  const data = await readJSONFile("src/data/book orders.json");
  data.forEach((record: BookOrderRecord) => logger.info(record));
}

main();