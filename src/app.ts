import { Interface } from "readline";
import logger from "./util/logger";

export interface Order {
  price: number;
  id: number;
  item: string;
}

export class OrderManagement {
  private orders: Order[] = [];
  constructor(private validator: IValidator, private calculator: ICalculator) {
    logger.debug("OrderManagement instance created");
  }

  getOrders() {
    return this.orders;
  }

  addOrder(item: string, price: number) {
    try {
      const order: Order = { id: this.orders.length + 1, item, price };
      this.validator.validate(order);
      this.orders.push(order);
    } catch (error: any) {
      throw new Error("[OrderManagement] Error adding order: " + error.message);
    }
  }

  getOrder(id: number) {
    const order = this.getOrders().find((order) => order.id === id);
    if (!order) {
      logger.warn(`Order with ID ${id} not found`);
    }
    return order;
  }

  getTotalRevenue() {
    return this.calculator.getRevenue(this.orders);
  }

  getBuyPower() {
    return this.calculator.getAverageBuyPower(this.orders);
  }
}

export class PremiumOrderManagement extends OrderManagement {
  getOrder(id: number): Order | undefined {
    console.log("Alert: Premium order being fetched");
    return super.getOrder(id);
  }
}

interface IValidator {
  validate(order: Order): void;
}

export class Validator implements IValidator {
  constructor(private rules: IValidator[]) {}

  validate(order: Order): void {
    this.rules.forEach((rule) => rule.validate(order));
  }
}

export class ItemValidator implements IValidator {
  private static possibleItems = [
    "Sponge",
    "Chocolate",
    "Fruit",
    "Red Velvet",
    "Birthday",
    "Carrot",
    "Marble",
    "Coffee",
  ];
  validate(order: Order) {
    if (!ItemValidator.possibleItems.includes(order.item)) {
      throw new Error(
        `Invalid Item. Must be one of: ${ItemValidator.possibleItems.join(
          ", "
        )}`
      );
    }
  }
}

export class PriceValidator implements IValidator {
  validate(order: Order) {
    if (order.price <= 0) {
      logger.error(`Price is negative: ${order.item}`);
      throw new Error("Price must be greater than zero");
    }
  }
}

export class MaxPriceValidator implements IValidator {
  validate(order: Order) {
    if (order.price > 100) {
      throw new Error("Price must be less than 100");
    }
  }
}

export interface ICalculator {
  getRevenue(orders: Order[]): number;
  getAverageBuyPower(order: Order[]): number;
}

export class FinanceCalculator implements ICalculator {
  static getAverageBuyPower(orders: Order[]) {
    throw new Error("Method not implemented.");
  }
  public getRevenue(orders: Order[]) {
    return orders.reduce((total, order) => total + order.price, 0);
  }

  public getAverageBuyPower(orders: Order[]) {
    return orders.length === 0 ? 0 : this.getRevenue(orders) / orders.length;
  }
}
