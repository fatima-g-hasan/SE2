import { MapperFactory, MapperMode } from "../../src/mappers/Mapper.factory";
import { CSVCakeMapper, SQLiteCakeMapper } from "../../src/mappers/Cake.mapper";
import { JSONBookMapper, SQLBookMapper } from "../../src/mappers/Book.mapper";
import { SQLToyMapper, XMLToyMapper } from "../../src/mappers/Toy.mapper";
import { CSVOrderMapper, JSONOrderMapper, XMLOrderMapper, SQLiteOrderMapper } from "../../src/mappers/Order.mapper";

describe("MapperFactory", () => {

  // Cake Mappers 
  test("should create a CSVCakeMapper for CSV mode", () => {
    const mapper = MapperFactory.createCakeMapper(MapperMode.CSV);
    expect(mapper).toBeInstanceOf(CSVCakeMapper);
  });

  test("should create a SQLiteCakeMapper for SQLITE mode", () => {
    const mapper = MapperFactory.createCakeMapper(MapperMode.SQLITE);
    expect(mapper).toBeInstanceOf(SQLiteCakeMapper);
  });

  test("should throw error for unsupported Cake mapper mode", () => {
    expect(() => MapperFactory.createCakeMapper(MapperMode.JSON)).toThrow("Unsupported mapper mode for Cake");
  });

  // Book Mappers 
  test("should create a JSONBookMapper for JSON mode", () => {
    const mapper = MapperFactory.createBookMapper(MapperMode.JSON);
    expect(mapper).toBeInstanceOf(JSONBookMapper);
  });

  test("should create a SQLBookMapper for SQLITE mode", () => {
    const mapper = MapperFactory.createBookMapper(MapperMode.SQLITE);
    expect(mapper).toBeInstanceOf(SQLBookMapper);
  });

  test("should throw error for unsupported Book mapper mode", () => {
    expect(() => MapperFactory.createBookMapper(MapperMode.XML)).toThrow("Unsupported mapper mode for Book");
  });

  // Toy Mappers
  test("should create an XMLToyMapper for XML mode", () => {
    const mapper = MapperFactory.createToyMapper(MapperMode.XML);
    expect(mapper).toBeInstanceOf(XMLToyMapper);
  });

  test("should create an SQLToyMapper for SQLITE mode", () => {
    const mapper = MapperFactory.createToyMapper(MapperMode.SQLITE);
    expect(mapper).toBeInstanceOf(SQLToyMapper);
  });

  test("should throw error for unsupported Toy mapper mode", () => {
    expect(() => MapperFactory.createToyMapper(MapperMode.JSON)).toThrow("Unsupported mapper mode for Toy");
  });

  // Order Mappers
  const dummyItemMapper = { map: jest.fn(), reverseMap: jest.fn() };

  test("should create a CSVOrderMapper for CSV mode", () => {
    const mapper = MapperFactory.createOrderMapper(MapperMode.CSV, dummyItemMapper);
    expect(mapper).toBeInstanceOf(CSVOrderMapper);
  });

  test("should create a JSONOrderMapper for JSON mode", () => {
    const mapper = MapperFactory.createOrderMapper(MapperMode.JSON, dummyItemMapper);
    expect(mapper).toBeInstanceOf(JSONOrderMapper);
  });

  test("should create an XMLOrderMapper for XML mode", () => {
    const mapper = MapperFactory.createOrderMapper(MapperMode.XML, dummyItemMapper);
    expect(mapper).toBeInstanceOf(XMLOrderMapper);
  });

  test("should create a SQLiteOrderMapper for SQLITE mode", () => {
    const mapper = MapperFactory.createOrderMapper(MapperMode.SQLITE, dummyItemMapper);
    expect(mapper).toBeInstanceOf(SQLiteOrderMapper);
  });

  test("should throw error for unsupported Order mapper mode", () => {
    expect(() => MapperFactory.createOrderMapper(99 as MapperMode, dummyItemMapper))
      .toThrow("Unsupported mapper mode for Order");
  });

});
