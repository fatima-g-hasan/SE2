import { CSVCakeMapper, SQLiteCakeMapper } from "./Cake.mapper";
import {
  CSVOrderMapper,
  JSONOrderMapper,
  SQLiteOrderMapper,
  XMLOrderMapper
} from "./Order.mapper";
import { JSONBookMapper, SQLBookMapper } from "./Book.mapper";
import { SQLToyMapper, XMLToyMapper } from "./Toy.mapper";
import { IItem } from "../model/IItem";
import { IMapper } from "./IMapper";

export enum MapperMode {
  CSV,
  SQLITE,
  JSON,
  XML
}

export class MapperFactory {
  public static createCakeMapper(
    mode: MapperMode.CSV
  ): CSVCakeMapper;

  public static createCakeMapper(
    mode: MapperMode.SQLITE
  ): SQLiteCakeMapper;

  public static createCakeMapper(mode: MapperMode) {
    switch (mode) {
      case MapperMode.CSV:
        return new CSVCakeMapper();

      case MapperMode.SQLITE:
        return new SQLiteCakeMapper();

      default:
        throw new Error("Unsupported mapper mode for Cake");
    }
  }

    public static createBookMapper(
    mode: MapperMode.JSON
  ): JSONBookMapper;

  public static createBookMapper(
    mode: MapperMode.SQLITE
  ): SQLBookMapper;

  public static createBookMapper(mode: MapperMode) {
    switch (mode) {
      case MapperMode.JSON:
        return new JSONBookMapper();

      case MapperMode.SQLITE:
        return new SQLBookMapper();

      default:
        throw new Error("Unsupported mapper mode for Book");
    }
  }


    public static createToyMapper(
    mode: MapperMode.XML
  ): XMLToyMapper;

  public static createToyMapper(
    mode: MapperMode.SQLITE
  ): SQLToyMapper;

  public static createToyMapper(mode: MapperMode) {
    switch (mode) {
      case MapperMode.XML:
        return new XMLToyMapper();

      case MapperMode.SQLITE:
        return new SQLToyMapper();

      default:
        throw new Error("Unsupported mapper mode for Toy");
    }
  }


    public static createOrderMapper(
    mode: MapperMode.CSV,
    itemMapper: IMapper<string[], IItem>
  ): CSVOrderMapper;

  public static createOrderMapper(
    mode: MapperMode.JSON,
    itemMapper: IMapper<Record<string, string>, IItem>
  ): JSONOrderMapper;

  public static createOrderMapper(
    mode: MapperMode.XML,
    itemMapper: IMapper<Record<string, string>, IItem>
  ): XMLOrderMapper;

  public static createOrderMapper(
    mode: MapperMode.SQLITE
  ): SQLiteOrderMapper;

  public static createOrderMapper(
    mode: MapperMode,
    itemMapper?: IMapper<any, IItem>
  ) {
    switch (mode) {
      case MapperMode.CSV:
        return new CSVOrderMapper(itemMapper!);

      case MapperMode.JSON:
        return new JSONOrderMapper(itemMapper!);

      case MapperMode.XML:
        return new XMLOrderMapper(itemMapper!);

      case MapperMode.SQLITE:
        return new SQLiteOrderMapper();

      default:
        throw new Error("Unsupported mapper mode for Order");
    }
  }
}