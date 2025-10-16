// import logger from "./util/logger";
// import { readCSVFile } from "./util/csv-parser";


// async function main() {
//   const data = await readCSVFile("src/data/cake orders.csv");
//   data.forEach((row) => logger.info(row));
// }

// main();

import { readJSONFile } from "./util/jsonParser";
import logger from "./util/logger";
async function main() {
  const data = await readJSONFile("src/data/book orders.json");
  data.forEach((record: any) => logger.info(record));
}

main();