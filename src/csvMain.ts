import logger from "./util/logger";
import { readCSVFile } from "./util/csv-parser";

async function main() {
  const data = await readCSVFile("src/data/cake orders.csv");
  data.forEach((row) => logger.info(row));
}

main();
