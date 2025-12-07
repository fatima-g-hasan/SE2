import { RepositoryFactory } from "../repository/Repository.factory";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { ItemCategory } from "../model/IItem";
import { IRepository } from "../repository/IRepository";
import { DBMode } from "../config/types";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";


export class OrderManagementService {
  // create an order
  public async createOrder(order: IIdentifiableOrderItem): Promise<IIdentifiableOrderItem> {
    // validation order
    this.validateOrder(order);

    // persist the new order
    const repo = await this.getRepo(order.getItem().getCategory());
    await repo.create(order);
    return order;
  }

  // get order
  public async getOrder(id: string): Promise<IIdentifiableOrderItem> {
    const categories = Object.values(ItemCategory);
    for (const category of categories) {
      try {
        const repo = await this.getRepo(category);
        const order = await repo.get(id);
        if (order) {
          return order;
        }
      } catch (error) {
        // ignore the error and continue to the next category
      }
    }
    throw new NotFoundException(`Order with id ${id} not found`);
  }

  // Update order
  public async updateOrder(order: IIdentifiableOrderItem): Promise<void> {
    // validation order
    this.validateOrder(order);

    // persist the new order
    const repo = await this.getRepo(order.getItem().getCategory());
    await repo.update(order);
  }

  // Delete order
  public async deleteOrder(id: string): Promise<void> {
    const categories = Object.values(ItemCategory);
    for (const category of categories) {
      const repo = await this.getRepo(category);
      const order = await repo.get(id);
      if (order) {
        await repo.delete(id);
        return;
      }
    }
    throw new NotFoundException(`Order with id ${id} not found`);
  }

  // Get all orders
  public async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
    const categories = Object.values(ItemCategory);
    const allOrders: IIdentifiableOrderItem[] = [];
    for (const category of categories) {
      const repo = await this.getRepo(category);
      const orders = await repo.getAll();
      allOrders.push(...orders);
    }
    return allOrders
  }

  private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
    return RepositoryFactory.create(DBMode.SQLITE, category);
  }

  private validateOrder(order: IIdentifiableOrderItem): void {
    if (!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
      const details = {
        ItemNotDefined: !order.getItem(),
        PriceNegative: order.getPrice() <= 0,
        QuantityNegative: order.getQuantity() <= 0
      }
      throw new BadRequestException("Invalid order: item, price, and quantity must be valid.", details)
    }
  }

  // get total revenue
  public async getTotalRevenue(): Promise<number> {
    const orders = await this.getAllOrders();
    const revenues = orders.map(order => order.getPrice() * order.getQuantity());
    let total = 0;
    for (const revenue of revenues) {
      total += revenue;
    }
    return total;
  }

  // get revenue by item type
  public async getRevenueByItemType(): Promise<Record<string, number>> {
    const orders = await this.getAllOrders();
    const revenueByItemType: Record<string, number> = {};

    for (const order of orders) {
      const type = order.getItem().getCategory();
      const revenue = order.getPrice() * order.getQuantity();
      revenueByItemType[type] = (revenueByItemType[type] || 0) + revenue;
    }

    return revenueByItemType;
  }


  // get total orders
  public async getTotalOrders(): Promise<number> {
    const orders = await this.getAllOrders();
    return orders.length;
  }

  // order count by item type
  public async getOrdersByItemType(): Promise<Record<string, number>> {
    const orders = await this.getAllOrders();
    const ordersByItemType: Record<string, number> = {};

    for (const order of orders) {
      const type = order.getItem().getCategory();
      ordersByItemType[type] = (ordersByItemType[type] || 0) + 1;
    }

    return ordersByItemType;
  }

}
