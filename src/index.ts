import { readCSVFile } from "./util/csv-parser";
import { CSVCakeMapper } from "./mappers/Cake.mapper";
import logger from "./util/logger";
import { CSVOrderMapper } from "./mappers/Order.mapper";



export async function main() {
  const data = await readCSVFile("src/data/cake orders.csv");
  const cakeMapper = new CSVCakeMapper();
  const orderMapper = new CSVOrderMapper(cakeMapper);
  const orders = data.map(orderMapper.map.bind(orderMapper));

  logger.info("List of orders: \n %o", orders)
}

main();