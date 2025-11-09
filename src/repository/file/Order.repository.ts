import { InvalidItemException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { ID, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { IOrder } from "../../model/IOrder";
import {id} from "../IRepository";

export abstract class OrderRepository implements IRepository<IOrder> {

  protected abstract load(): Promise<IOrder[]>;
  protected abstract save(orders: IOrder[]): Promise<void>;


  async create(item: IOrder): Promise<id> {
    // validate the IOrder
    if (!item) {
      throw new InvalidItemException("Order cannot be null");
    }
    // load all orders
    const orders = await this.load();
    // add the new IOrder
    const id = orders.push(item);
    // save all orders
    await this.save(orders);
    logger.info("Successfully created IOrder of id %d", id);
    return String(id);
  }

  async get(id: string): Promise<IOrder> {
    const orders = await this.load();
    const foundOrder = orders.find(o => o.getId() === id);
    if (!foundOrder) {
      logger.error("Failed to find IOrder of id %s", id);
      throw new ItemNotFoundException("Failed to find the element");
    }
    logger.info("Found item of id %s", id);
    return foundOrder;
  }

  async getAll(): Promise<IOrder[]> {
    const orders = await this.load();
    logger.info("Retrieving %d elements", orders.length);
    return orders;
  }

  async update(item: IOrder): Promise<void> {
    if (!item) {
      logger.error("Order cannot be null");
      throw new InvalidItemException("Order cannot be null");
    }
    const orders = await this.load();
    const index = orders.findIndex(o => o.getId() === item.getId());
    if (index === -1) {
      logger.error("Failed to find IOrder of id %s", item.getId());
      throw new ItemNotFoundException("Failed to find the element");
    }
    orders[index] = item;
    await this.save(orders);
  }

  async delete(id: string): Promise<void> {
    const orders = await this.load();
    const index = orders.findIndex(o => o.getId() === id);
    if (index === -1) {
      logger.error("Failed to find Order of id %s", id);
      throw new ItemNotFoundException("Failed to find the element");
    }
    orders.splice(index, 1);
    await this.save(orders);
    logger.info("Successfully deleted Order of id %s", id);
  }
}