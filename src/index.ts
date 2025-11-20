// import logger from "./util/logger";
// import { JSONOrderMapper, XMLOrderMapper } from "./mappers/Order.mapper";
// import { readJSONFile } from "./util/jsonParser";
// import { JSONBookMapper } from "./mappers/Book.mapper";
// import { readXMLFile } from "./util/xmlParser";
// import { XMLToyMapper } from "./mappers/Toy.mapper";
// import  config  from "./config";
// import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
// import { OrderRepository } from "./repository/sqlite/Order.repository";
// import { CakeRepository } from "./repository/sqlite/Cake.order.repository";
// import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/cake.builder";
// import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/builders/order.builder";


import "dotenv/config";
import logger from "./util/logger";
import { PGConnectionManager } from "./repository/postgreSQL/PGConnectionManager";

import { PostgresCakeRepository } from "./repository/postgreSQL/PGCake.order.repository";
import { PostgresBookRepository } from "./repository/postgreSQL/PGBook.order.repository";
import { PostgresToyRepository } from "./repository/postgreSQL/PGToy.order.repository";
import { PostgresOrderRepository } from "./repository/postgreSQL/PGOrder.repository";

import { IdentifiableCake } from "./model/Cake.model";
import { IdentifiableBook } from "./model/Book.model";
import { IIdentifiableItem, ItemCategory } from "./model/IItem";
import { IIdentifiableOrderItem } from "./model/IOrder";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/cake.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/builders/order.builder";
import { OrderRepository } from "repository/sqlite/Order.repository";
import { CakeRepository } from "repository/sqlite/Cake.order.repository";
import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
import config from "./config";
import { DBMode, RepositoryFactory } from "./repository/Repository.factory";

// async function main() {
//   try {
//     const client = PGConnectionManager.getClient();

//     const cakeRepo = new PostgresCakeRepository();
//     const bookRepo = new PostgresBookRepository();
//     const toyRepo = new PostgresToyRepository();


//     await cakeRepo.init();
//     await bookRepo.init();
//     await toyRepo.init();

//     const orderRepo = new PostgresOrderRepository(cakeRepo);
//     await orderRepo.init();

//     const cake = new IdentifiableCake(
//       "cake-1",
//       "Chocolate Cake",
//       "Chocolate",
//       "Cream",
//       8,
//       2,
//       "Buttercream",
//       "Vanilla",
//       "Sprinkles",
//       "Red",
//       "Happy Birthday",
//       "Round",
//       "Nuts",
//       "Secret Ingredient",
//       "Box"
//     );

//     const cakeId = await cakeRepo.create(cake);
//     logger.info("Created Cake with id:", cakeId);

//     const retrievedCake = await cakeRepo.get(cakeId);
//     logger.info("Retrieved Cake:", retrievedCake);

//     const allCakes = await cakeRepo.getAll();
//     logger.info("All Cakes:", allCakes);

//     const updatedCake = IdentifiableCakeBuilder
//       .newBuilder()
//       .setId(retrievedCake.getId())  
//       .setCake(
//         CakeBuilder
//           .fromExisting(retrievedCake)    
//           .setFlavor("Vanilla")          
//           .build()                      
//       )
//       .build();          

//     // Delete Cake
//     await cakeRepo.delete(cakeId);
//     logger.info("Deleted Cake with id:", cakeId);

//   } catch (error) {
//     logger.error("Error in main:", error);
//   }
// }

// main();





export async function mapCake() {
  const path = config.storagePath.csv.cake;
  const repository = new CakeOrderRepository(path);
  const data = await repository.get("1");
  logger.info("List of orders: \n %o", data)
}


async function DBSandBox() {
  const dbOrder = RepositoryFactory.create(DBMode.SQLITE, ItemCategory.CAKE);

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

  (await dbOrder).create(idOrder);

  (await dbOrder).delete(idOrder.getId());

  (await dbOrder).update(idOrder);
}

DBSandBox().catch((error) => logger.error("Error in DBSandBox", error as Error));



// export async function mapBook() {
//   const data = await readJSONFile("src/data/book orders.json");
//   const bookMapper = new JSONBookMapper();
//   const orderMapper = new JSONOrderMapper(bookMapper);
//   const orders = data.map(orderMapper.map.bind(orderMapper));

//   logger.info("List of orders: \n %o", orders)
// }



// export async function mapToy() {
//   const parsed = await readXMLFile("src/data/toy orders.xml");
//   const toyMapper = new XMLToyMapper();
//   const orderMapper = new XMLOrderMapper(toyMapper);
//   const rows = parsed.data.row;
//   const orders = rows.map(orderMapper.map.bind(orderMapper));

//   logger.info("List of orders: \n %o", orders)
// }


// function newCakeOrderRepository(path: string) {
//   throw new Error("Function not implemented.");
// }

