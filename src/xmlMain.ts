import logger from "./util/logger";
import { readXMLFile } from "./util/xmlParser";

async function main() {
  try {
    const data = await readXMLFile("src/data/toy orders.xml");
    const rows = data.data.row;

    rows.forEach((order: any, index: number) => {
      logger.info(`Order ${index + 1}:`);
      Object.entries(order).forEach(([key, value]) => {
        logger.info(`  ${key}: ${value}`);
      });
    });
  } catch (error) {
    logger.info(`Error: ${(error as Error).message}`);
  }
}

main();
