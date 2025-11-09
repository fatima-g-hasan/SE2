import logger from "./util/logger";
import { JSONOrderMapper, XMLOrderMapper } from "./mappers/Order.mapper";
import { readJSONFile } from "./util/jsonParser";
import { JSONBookMapper } from "./mappers/Book.mapper";
import { readXMLFile } from "./util/xmlParser";
import { XMLToyMapper } from "./mappers/Toy.mapper";
import  config  from "./config";
import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
import { OrderRepository } from "./repository/sqlite/Order.repository";
import { CakeRepository } from "./repository/sqlite/Cake.order.repository";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/cake.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/builders/order.builder";



export async function mapCake() {
  const path = config.storagePath.csv.cake;
  const repository = new CakeOrderRepository(path);
  const data = await repository.get("1");
  logger.info("List of orders: \n %o", data)
}

// mapCake()


async function DBSandBox() {
  const dbOrder = new OrderRepository(new CakeRepository());
  await dbOrder.init();

  // create identifiable cake
  const cake = CakeBuilder.newBuilder().setType("Birthday")
                                        .setFlavor("Chocolate")
                                        .setFilling("Vanilla")
                                        .setSize(10)
                                        .setLayers(2)
                                        .setFrostingType("Buttercream")
                                        .setFrostingFlavor("Vanilla")
                                        .setDecorationType("Sprinkles")
                                        .setDecorationColor("Blue")
                                        .setCustomMessage("Happy Birthday")
                                        .setShape("Round")
                                        .setAllergies("None")
                                        .setSpecialIngredients("None")
                                        .setPackagingType("Box")
                                        .build();

  const idCake = IdentifiableCakeBuilder.newBuilder().setCake(cake).setId(Math.random().toString(36).substring(2, 5)).build();

  // create identifiable order
  const order = OrderBuilder.newBuilder()
  .setPrice(100).setItem(cake).setQuantity(1).setId(Math.random().toString(36).substring(2, 5)).build();
  const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItem(idCake).setOrder(order).build();

  await dbOrder.create(idOrder);

  console.log(await dbOrder.get(idOrder.getId()));
}

DBSandBox().catch((error) => logger.error("Error in DBSandBox", error as Error));



// export async function mapBook() {
//   const data = await readJSONFile("src/data/book orders.json");
//   const bookMapper = new JSONBookMapper();
//   const orderMapper = new JSONOrderMapper(bookMapper);
//   const orders = data.map(orderMapper.map.bind(orderMapper));

//   logger.info("List of orders: \n %o", orders)
// }

// mapBook();


// export async function mapToy() {
//   const parsed = await readXMLFile("src/data/toy orders.xml");
//   const toyMapper = new XMLToyMapper();
//   const orderMapper = new XMLOrderMapper(toyMapper);
//   const rows = parsed.data.row;
//   const orders = rows.map(orderMapper.map.bind(orderMapper));

//   logger.info("List of orders: \n %o", orders)
// }

// mapToy();

// function newCakeOrderRepository(path: string) {
//   throw new Error("Function not implemented.");
// }

