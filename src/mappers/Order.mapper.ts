import { IdentifiableOrderItemBuilder, OrderBuilder } from "../model/builders/order.builder";
import { IIdentifiableOrderItem, IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";
import { IIdentifiableItem, IItem } from "../model/IItem";
import { IdentifiableOrderItem } from "model/Order.model";


export interface SQLiteOrder {
  id: string;
  quantity: number;
  price: number;
  item_category: string;
  item_id: string;
}

export class SQLiteOrderMapper implements IMapper<{data: SQLiteOrder, item: IIdentifiableItem}, IdentifiableOrderItem> {
  map({data, item}: {data: SQLiteOrder, item: IIdentifiableItem}): IdentifiableOrderItem {
    const order = OrderBuilder.newBuilder().setId(data.id)
    .setPrice(data.price)
    .setQuantity(data.quantity)
    .setItem(item)
    .build();
    return IdentifiableOrderItemBuilder.newBuilder().setOrder(order).setItem(item).build();
  }
  reverseMap(data: IdentifiableOrderItem): {data: SQLiteOrder, item: IIdentifiableItem} {
    return {
      data: {
        id: data.getId(),
        price: data.getPrice(),
        quantity: data.getQuantity(),
        item_category: data.getItem().getCategory(),
        item_id: data.getItem().getId()
      },
      item: data.getItem()
    }
  }

}

export class OrderMapper implements IMapper<Record<string, string>, IOrder> {
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

  reverseMap(data: IOrder): Record<string, string> {
      const item = this.itemMapper.reverseMap(data.getItem());
      return {
        "Order Id": data.getId(),
        ...item,
        "Price": data.getPrice().toString(),
        "Quantity": data.getQuantity().toString()
      };
  }
}

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
  reverseMap(data: IOrder): string[] {
    const item = this.itemMapper.reverseMap(data.getItem());
    return [
      data.getId(),
      ...item,
      data.getPrice().toString(),
      data.getQuantity().toString()
    ]
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

  reverseMap(data: IOrder): Record<string, string> {
      const item = this.itemMapper.reverseMap(data.getItem());
      return {
        "Order Id": data.getId(),
        ...item,
        "Price": data.getPrice().toString(),
        "Quantity": data.getQuantity().toString()
      };
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

    reverseMap(data: IOrder): Record<string, string> {
      const item = this.itemMapper.reverseMap(data.getItem());
      return {
        "Order Id": data.getId(),
        ...item,
        "Price": data.getPrice().toString(),
        "Quantity": data.getQuantity().toString()
      }
    } 
}