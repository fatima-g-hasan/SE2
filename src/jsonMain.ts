import { readJSONFile } from "./util/jsonParser";
import logger from "./util/logger";
async function main() {
  const data = await readJSONFile("src/data/book orders.json");
  data.forEach((record: any) => logger.info(record));
}

main();