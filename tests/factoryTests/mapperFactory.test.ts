import { MapperFactory, MapperMode } from "../../src/mappers/Mapper.factory";

// Cake
import { CSVCakeMapper, SQLiteCakeMapper } from "../../src/mappers/Cake.mapper";

// Book
import { JSONBookMapper, SQLBookMapper } from "../../src/mappers/Book.mapper";

// Toy
import { SQLToyMapper, XMLToyMapper } from "../../src/mappers/Toy.mapper";

// Order
import {
  CSVOrderMapper,
  JSONOrderMapper,
  XMLOrderMapper,
} from "../../src/mappers/Order.mapper";

import { IMapper } from "../../src/mappers/IMapper";
import { IItem } from "../../src/model/IItem";

describe("MapperFactory", () => {

  // =========================
  // CAKE
  // =========================

  test("should create CSVCakeMapper for CSV mode", () => {
    const mapper = MapperFactory.createCakeMapper(MapperMode.CSV);
    expect(mapper).toBeInstanceOf(CSVCakeMapper);
  });

  test("should create SQLiteCakeMapper for SQLITE mode", () => {
    const mapper = MapperFactory.createCakeMapper(MapperMode.SQLITE);
    expect(mapper).toBeInstanceOf(SQLiteCakeMapper);
  });

  test("should throw error for unsupported Cake mode", () => {
    expect(() =>
      (MapperFactory.createCakeMapper as any)(MapperMode.JSON)
    ).toThrow("Unsupported mapper mode for Cake");
  });

  // =========================
  // BOOK
  // =========================

  test("should create JSONBookMapper for JSON mode", () => {
    const mapper = MapperFactory.createBookMapper(MapperMode.JSON);
    expect(mapper).toBeInstanceOf(JSONBookMapper);
  });

  test("should create SQLBookMapper for SQLITE mode", () => {
    const mapper = MapperFactory.createBookMapper(MapperMode.SQLITE);
    expect(mapper).toBeInstanceOf(SQLBookMapper);
  });

  test("should throw error for unsupported Book mode", () => {
    expect(() =>
      (MapperFactory.createBookMapper as any)(MapperMode.XML)
    ).toThrow("Unsupported mapper mode for Book");
  });

  // =========================
  // TOY
  // =========================

  test("should create XMLToyMapper for XML mode", () => {
    const mapper = MapperFactory.createToyMapper(MapperMode.XML);
    expect(mapper).toBeInstanceOf(XMLToyMapper);
  });

  test("should create SQLToyMapper for SQLITE mode", () => {
    const mapper = MapperFactory.createToyMapper(MapperMode.SQLITE);
    expect(mapper).toBeInstanceOf(SQLToyMapper);
  });

  test("should throw error for unsupported Toy mode", () => {
    expect(() =>
      (MapperFactory.createToyMapper as any)(MapperMode.JSON)
    ).toThrow("Unsupported mapper mode for Toy");
  });

  // =========================
  // ORDER
  // =========================

  const dummyItemMapper: IMapper<any, IItem> = {
    map: jest.fn(),
    reverseMap: jest.fn()
  };

  test("should create CSVOrderMapper for CSV mode", () => {
    const mapper = MapperFactory.createOrderMapper(
      MapperMode.CSV,
      dummyItemMapper
    );
    expect(mapper).toBeInstanceOf(CSVOrderMapper);
  });

  test("should create JSONOrderMapper for JSON mode", () => {
    const mapper = MapperFactory.createOrderMapper(
      MapperMode.JSON,
      dummyItemMapper
    );
    expect(mapper).toBeInstanceOf(JSONOrderMapper);
  });

  test("should create XMLOrderMapper for XML mode", () => {
    const mapper = MapperFactory.createOrderMapper(
      MapperMode.XML,
      dummyItemMapper
    );
    expect(mapper).toBeInstanceOf(XMLOrderMapper);
  });
});