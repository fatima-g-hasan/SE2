import dotenv from "dotenv";
import { PostgresOrderRepository } from "../../src/repository/postgreSQL/PGOrder.repository";
import { PGConnectionManager } from "../../src/repository/postgreSQL/PGConnectionManager";
import { makeCake } from "./helper";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "../../src/model/builders/order.builder";
import { DbException } from "../../src/util/exceptions/repositoryExceptions";
import { PostgresCakeRepository } from "../../src/repository/postgreSQL/PGCake.order.repository";

dotenv.config({ path: ".env.test" });

describe("PostgresOrderRepository Integration Tests", () => {
  let repo: PostgresOrderRepository;

  beforeAll(async () => {
    PGConnectionManager.getClient();
  });

  beforeEach(async () => {
    const itemRepo = new PostgresCakeRepository();
    repo = new PostgresOrderRepository(itemRepo);

    await repo.init();

    const client = PGConnectionManager.getClient();
    await client.query(`DELETE FROM "order"`);
    await client.query(`DELETE FROM cake`);
  });

  afterAll(async () => {
    const client = PGConnectionManager.getClient();
    await client.query(`DROP TABLE IF EXISTS "order"`);
  });


  it("should create a new order and retrieve it", async () => {
    const cake = makeCake("cake-1");
    const order = OrderBuilder.newBuilder()
      .setId("order-1")
      .setItem(cake)
      .setQuantity(2)
      .setPrice(40)
      .build();

    const identifiableOrder = IdentifiableOrderItemBuilder
      .newBuilder()
      .setItem(cake)
      .setOrder(order)
      .build();

    const id = await repo.create(identifiableOrder);
    expect(id).toBe("order-1");

    const found = await repo.get("order-1");
    expect(found.getId()).toBe("order-1");
    expect(found.getQuantity()).toBe(2);
  });


  it("should return all orders", async () => {
    const cake1 = makeCake("c1");
    const cake2 = makeCake("c2");

    await repo.create(
      IdentifiableOrderItemBuilder.newBuilder()
        .setItem(cake1)
        .setOrder(
          OrderBuilder.newBuilder().setId("o1").setItem(cake1).setQuantity(1).setPrice(10).build()
        )
        .build()
    );

    await repo.create(
      IdentifiableOrderItemBuilder.newBuilder()
        .setItem(cake2)
        .setOrder(
          OrderBuilder.newBuilder().setId("o2").setItem(cake2).setQuantity(2).setPrice(20).build()
        )
        .build()
    );

    const orders = await repo.getAll();
    expect(orders.length).toBe(2);

    const ids = orders.map(o => o.getId());
    expect(ids).toContain("o1");
    expect(ids).toContain("o2");
  });


  it("should update an existing order", async () => {
    const cake = makeCake("cake-1");
    const order = OrderBuilder.newBuilder()
      .setId("order-1")
      .setItem(cake)
      .setQuantity(2)
      .setPrice(40)
      .build();

    const identifiableOrder = IdentifiableOrderItemBuilder
      .newBuilder()
      .setItem(cake)
      .setOrder(order)
      .build();

    await repo.create(identifiableOrder);

    const updatedOrder = OrderBuilder.newBuilder()
      .setId("order-1")
      .setItem(cake)
      .setQuantity(5)
      .setPrice(40)
      .build();

    const updatedIdentifiable = IdentifiableOrderItemBuilder
      .newBuilder()
      .setItem(cake)
      .setOrder(updatedOrder)
      .build();

    await repo.update(updatedIdentifiable);

    const found = await repo.get("order-1");
    expect(found.getQuantity()).toBe(5);
  });

  it("should delete an existing order", async () => {
    const cake = makeCake("cake-1");
    const order = OrderBuilder.newBuilder()
      .setId("order-1")
      .setItem(cake)
      .setQuantity(2)
      .setPrice(40)
      .build();

    const identifiableOrder = IdentifiableOrderItemBuilder
      .newBuilder()
      .setItem(cake)
      .setOrder(order)
      .build();

    await repo.create(identifiableOrder);
    await repo.delete("order-1");

    await expect(repo.get("order-1")).rejects.toBeInstanceOf(DbException);
  });

  it("should rollback transaction if item insertion fails", async () => {
    const client = PGConnectionManager.getClient();
    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO "order" (id, quantity, price, item_category, item_id) VALUES ($1,$2,$3,$4,$5)`,
        ["order-rollback", 1, 10, "cake", "cake-rollback"]
      );

      await client.query("INVALID SQL");

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
    }
    await expect(repo.get("order-rollback")).rejects.toBeInstanceOf(DbException);
  });
});
