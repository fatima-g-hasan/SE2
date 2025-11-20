import { RepositoryFactory, DBMode } from "../../src/repository/Repository.factory";
import { ItemCategory } from "../../src/model/IItem";
import { CakeOrderRepository } from "../../src/repository/file/Cake.order.repository";
import { BookOrderRepository } from "../../src/repository/file/Book.order.repository";
import { ToyOrderRepository } from "../../src/repository/file/Toy.order.repository";
import { PostgresOrderRepository } from "../../src/repository/postgreSQL/PGOrder.repository";
import { OrderRepository } from "../../src/repository/sqlite/Order.repository";

jest.mock("../../src/repository/postgreSQL/PGCake.order.repository");
jest.mock("../../src/repository/postgreSQL/PGBook.order.repository");
jest.mock("../../src/repository/postgreSQL/PGToy.order.repository");
jest.mock("../../src/repository/postgreSQL/PGOrder.repository");


describe("RepositoryFactory", () => {

  // FILE mode
  test("should create a CakeOrderRepository in FILE mode", async () => {
    const repo = await RepositoryFactory.create(DBMode.FILE, ItemCategory.CAKE);
    expect(repo).toBeInstanceOf(CakeOrderRepository);
  });

  test("should create a BookOrderRepository in FILE mode", async () => {
    const repo = await RepositoryFactory.create(DBMode.FILE, ItemCategory.BOOK);
    expect(repo).toBeInstanceOf(BookOrderRepository);
  });

  test("should create a ToyOrderRepository in FILE mode", async () => {
    const repo = await RepositoryFactory.create(DBMode.FILE, ItemCategory.TOY);
    expect(repo).toBeInstanceOf(ToyOrderRepository);
  });

  // SQLITE mode
  test("should create an OrderRepository in SQLITE mode for Cake", async () => {
    const repo = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.CAKE);
    expect(repo).toBeInstanceOf(OrderRepository);
  });

  test("should throw error for unsupported category in SQLITE mode", async () => {
    await expect(
      RepositoryFactory.create(DBMode.SQLITE, "UNKNOWN" as ItemCategory)
    ).rejects.toThrow("Unsupported category");
  });

  // POSTGRES mode
  test("should create a PostgresOrderRepository in POSTGRES mode for Cake", async () => {
    const repo = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.CAKE);
    expect(repo).toBeInstanceOf(PostgresOrderRepository);
  });

  test("should throw error for unsupported DB mode", async () => {
    await expect(
      RepositoryFactory.create(999 as DBMode, ItemCategory.CAKE)
    ).rejects.toThrow("Unsupported DB mode");
  });

});
