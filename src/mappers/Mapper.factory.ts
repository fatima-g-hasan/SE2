import { CSVCakeMapper, SQLiteCakeMapper } from "./Cake.mapper";
import { CSVOrderMapper, JSONOrderMapper, SQLiteOrderMapper, XMLOrderMapper } from "./Order.mapper";
import { IMapper } from "./IMapper";
import { Cake, IdentifiableCake } from "../model/Cake.model";
import { IOrder } from "../model/IOrder";
import { JSONBookMapper, SQLBookMapper } from "./Book.mapper";
import { SQLToyMapper, XMLToyMapper } from "./Toy.mapper";

export enum MapperMode {
  CSV,
  SQLITE,
  JSON,
  XML
}


export class MapperFactory {

  public static createCakeMapper(mode: MapperMode): IMapper<any, any> {
    switch(mode) {
      case MapperMode.CSV:
        return new CSVCakeMapper();
      case MapperMode.SQLITE:
        return new SQLiteCakeMapper();
      default:
        throw new Error("Unsupported mapper mode for Cake");
    }
  }

  public static createBookMapper(mode: MapperMode): IMapper<any, any> {
    switch(mode) {
      case MapperMode.JSON:
        return new JSONBookMapper();
      case MapperMode.SQLITE:
        return new SQLBookMapper();
      default:
        throw new Error("Unsupported mapper mode for Book");
    }
  }
  public static createToyMapper(mode: MapperMode): IMapper<any, any> {
    switch(mode) {
      case MapperMode.XML:
        return new XMLToyMapper();
      case MapperMode.SQLITE:
        return new SQLToyMapper();
      default:
        throw new Error("Unsupported mapper mode for Toy");
    }
  }

  public static createOrderMapper(mode: MapperMode, itemMapper: IMapper<any, any>): IMapper<any, IOrder> {
    switch(mode) {

      case MapperMode.CSV:
        return new CSVOrderMapper(itemMapper);

      case MapperMode.JSON:
        return new JSONOrderMapper(itemMapper);

      case MapperMode.XML:
        return new XMLOrderMapper(itemMapper);

      case MapperMode.SQLITE:
        return new SQLiteOrderMapper();
        
      default:
        throw new Error("Unsupported mapper mode for Order");
    }
  }
}
