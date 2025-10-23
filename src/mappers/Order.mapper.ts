import { OrderBuilder } from "../model/builders/order.builder";
import { IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";
import { IItem } from "../model/IItem";

export class CSVOrderMapper implements IMapper<string[], IOrder> {
  itemMapper: IMapper<string[], IItem>;
  constructor(itemMapper: IMapper<string[], IItem>) {
    this.itemMapper = itemMapper;
  }

  
  map(data: string[]): IOrder {
    const item: IItem = this.itemMapper.map(data);
    return OrderBuilder.newBuilder()
                       .setId(data[0])
                       .setQuantity(parseInt(data[data.length - 1]))
                       .setPrice(parseInt(data[data.length - 2]))
                       .setItem(item)
                       .build();
  }
  
}


export class JSONOrderMapper implements IMapper<Record<string, string>, IOrder> {
  itemMapper: IMapper<Record<string, string>, IItem>;
  constructor(itemMapper: IMapper<Record<string, string>, IItem>) {
    this.itemMapper = itemMapper;
  }

  map(data: Record<string, string>): IOrder {
    const item: IItem = this.itemMapper.map(data);
    const id = data["Order ID"];
    const price = parseInt(data["Price"]);
    const quantity = parseInt(data["Quantity"]);

    return OrderBuilder.newBuilder()
                       .setId(id)
                       .setItem(item)
                       .setPrice(price)
                       .setQuantity(quantity)
                       .build();
  }
}


export class XMLOrderMapper implements IMapper<Record<string, string>, IOrder> {
  itemMapper: IMapper<Record<string, string>, IItem>;
  constructor(itemMapper: IMapper<Record<string, string>, IItem>) {
    this.itemMapper = itemMapper;
  }

  map(data: Record<string, string>): IOrder {
    const item: IItem = this.itemMapper.map(data);
    const id = data["OrderID"];
    const price = parseInt(data["Price"]);
    const quantity = parseInt(data["Quantity"]);

    return OrderBuilder.newBuilder()
                       .setId(id)
                       .setItem(item)
                       .setPrice(price)
                       .setQuantity(quantity)
                       .build();
  }
}