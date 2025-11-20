import { IOrder } from "../model/IOrder";
import { Initializable, IRepository } from "./IRepository";
import { ItemCategory } from "../model/IItem";
import { CakeOrderRepository } from "./file/Cake.order.repository";
import config from "../config";
import { OrderRepository } from "./sqlite/Order.repository";
import { CakeRepository } from "./sqlite/Cake.order.repository";
import { BookRepository } from "./sqlite/Book.order.repositoy";
import { ToyRepository } from "./sqlite/Toy.order.repository";
import { BookOrderRepository } from "./file/Book.order.repository";
import { ToyOrderRepository } from "./file/Toy.order.repository";
import { PostgresOrderRepository } from "./postgreSQL/PGOrder.repository";
import { PostgresCakeRepository } from "./postgreSQL/PGCake.order.repository";
import { PostgresBookRepository } from "./postgreSQL/PGBook.order.repository";
import { PostgresToyRepository } from "./postgreSQL/PGToy.order.repository";

  
export enum DBMode {
  SQLITE,
  FILE,
  POSTGRES
}

export class RepositoryFactory {

  public static async create(mode: DBMode, category: ItemCategory): Promise<IRepository<IOrder>> {

    switch (mode) {
      case DBMode.SQLITE:
        let repository: IRepository<IOrder> & Initializable;
        switch (category) {
          case ItemCategory.CAKE:
            repository = new OrderRepository(new CakeRepository());
            break;
               
          case ItemCategory.BOOK:
            repository = new OrderRepository(new BookRepository());
            break;   

          case ItemCategory.TOY:
            repository = new OrderRepository(new ToyRepository());
            break;

          default:
            throw new Error("Unsupported category");
        }
        await repository.init();
        return repository;

  
      case DBMode.FILE:
        switch (category) {
          case ItemCategory.CAKE:
            return new CakeOrderRepository(config.storagePath.csv.cake);

          case ItemCategory.BOOK:
            return new BookOrderRepository(config.storagePath.json.book);

          case ItemCategory.TOY:
            return new ToyOrderRepository(config.storagePath.xml.toy);

          default:
            throw new Error("Unsupported category");
          }
      
          
      case DBMode.POSTGRES:
        switch (category) {
          case ItemCategory.CAKE:
            return new PostgresOrderRepository(new PostgresCakeRepository());
          
          case ItemCategory.BOOK:
            return new PostgresOrderRepository(new PostgresBookRepository());

          case ItemCategory.TOY:
            return new PostgresOrderRepository(new PostgresToyRepository());

          default:
            throw new Error("Unsupported category");
        }
  default:
    throw new Error("Unsupported DB mode");
    }
  }
}