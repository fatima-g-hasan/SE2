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

/* =========================
   MODE
========================= */

export enum MapperMode {
  CSV,
  SQLITE,
  JSON,
  XML
}

/* =========================
   ORDER ITEM MAPPER TYPES
========================= */

type OrderItemMapperMap = {
  [MapperMode.CSV]: IMapper<string[], IItem>;
  [MapperMode.JSON]: IMapper<Record<string, string>, IItem>;
  [MapperMode.XML]: IMapper<Record<string, string>, IItem>;
  [MapperMode.SQLITE]: never;
};

/* =========================
   FACTORY
========================= */

export class MapperFactory {

  /* =========================
     CAKE
  ========================= */

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

  /* =========================
     BOOK
  ========================= */

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

  /* =========================
     TOY
  ========================= */

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

  /* =========================
     ORDER
========================= */

  public static createOrderMapper(
    mode: MapperMode.CSV,
    itemMapper: OrderItemMapperMap[MapperMode.CSV]
  ): CSVOrderMapper;

  public static createOrderMapper(
    mode: MapperMode.JSON,
    itemMapper: OrderItemMapperMap[MapperMode.JSON]
  ): JSONOrderMapper;

  public static createOrderMapper(
    mode: MapperMode.XML,
    itemMapper: OrderItemMapperMap[MapperMode.XML]
  ): XMLOrderMapper;

  public static createOrderMapper(
    mode: MapperMode.SQLITE
  ): SQLiteOrderMapper;

  public static createOrderMapper(
    mode: MapperMode,
    itemMapper?: OrderItemMapperMap[MapperMode]
  ) {
    switch (mode) {
      case MapperMode.CSV:
        return new CSVOrderMapper(
          itemMapper as IMapper<string[], IItem>
        );

      case MapperMode.JSON:
        return new JSONOrderMapper(
          itemMapper as IMapper<Record<string, string>, IItem>
        );

      case MapperMode.XML:
        return new XMLOrderMapper(
          itemMapper as IMapper<Record<string, string>, IItem>
        );

      case MapperMode.SQLITE:
        return new SQLiteOrderMapper();

      default:
        throw new Error("Unsupported mapper mode for Order");
    }
  }
}