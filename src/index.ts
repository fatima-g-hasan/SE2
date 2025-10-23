import { readCSVFile } from "./util/csv-parser";
import { CSVCakeMapper } from "./mappers/Cake.mapper";
import logger from "./util/logger";
import { CSVOrderMapper, JSONOrderMapper, XMLOrderMapper } from "./mappers/Order.mapper";
import { readJSONFile } from "./util/jsonParser";
import { JSONBookMapper } from "./mappers/Book.mapper";
import { readXMLFile } from "./util/xmlParser";
import { XMLToyMapper } from "./mappers/Toy.mapper";



export async function mapCake() {
  const data = await readCSVFile("src/data/cake orders.csv");
  const cakeMapper = new CSVCakeMapper();
  const orderMapper = new CSVOrderMapper(cakeMapper);
  const orders = data.map(orderMapper.map.bind(orderMapper));

  logger.info("List of orders: \n %o", orders)
}

mapCake()


export async function mapBook() {
  const data = await readJSONFile("src/data/book orders.json");
  const bookMapper = new JSONBookMapper();
  const orderMapper = new JSONOrderMapper(bookMapper);
  const orders = data.map(orderMapper.map.bind(orderMapper));

  logger.info("List of orders: \n %o", orders)
}

mapBook();


export async function mapToy() {
  const parsed = await readXMLFile("src/data/toy orders.xml");
  const toyMapper = new XMLToyMapper();
  const orderMapper = new XMLOrderMapper(toyMapper);
  const rows = parsed.data.row;
  const orders = rows.map(orderMapper.map.bind(orderMapper));

  logger.info("List of orders: \n %o", orders)
}

mapToy();

