import "dotenv/config";
import logger from "./util/logger";
import { ItemCategory } from "./model/IItem";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/cake.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/builders/order.builder";
import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
import config from "./config";
import { DBMode, RepositoryFactory } from "./repository/Repository.factory";


export async function mapCake() {
  const path = config.storagePath.csv.cake;
  const repository = new CakeOrderRepository(path);
  const data = await repository.get("1");
  logger.info("List of orders: \n %o", data)
}


async function DBSandBox() {
  const dbOrder = await RepositoryFactory.create(DBMode.FILE, ItemCategory.CAKE);

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
  
  await dbOrder.update(idOrder);

  await dbOrder.delete(idOrder.getId());
}

DBSandBox().catch((error) => logger.error("Error in DBSandBox", error as Error));

