import { PostgresToyRepository } from "../../src/repository/postgreSQL/PGToy.order.repository";
import { PGConnectionManager } from "../../src/repository/postgreSQL/PGConnectionManager";
import { makeToy } from "./helper";
import dotenv from "dotenv";
import { DbException, ItemNotFoundException } from "../../src/util/exceptions/repositoryExceptions";
import { ToyBuilder } from "../../src/model/builders/toy.builder";

dotenv.config({ path: ".env.test" });

describe("PostgresToyRepository CRUD", () => {
  let repo: PostgresToyRepository;

  beforeAll(async () => {
    PGConnectionManager.getClient();
  });

  beforeEach(async () => {
    repo = new PostgresToyRepository();
    await repo.init();

    const client = PGConnectionManager.getClient();
    await client.query(`DELETE FROM toy;`);
  });


  it("should create a new toy and retrieve it", async () => {
    const toy = makeToy("toy-1");

    const id = await repo.create(toy);
    expect(id).toBe("toy-1");

    const found = await repo.get("toy-1");
    expect(found.getId()).toBe("toy-1");
    expect(found.getBrand()).toBe(toy.getBrand());
  });


  it("should return all toys", async () => {
    await repo.create(makeToy("t1"));
    await repo.create(makeToy("t2"));

    const result = await repo.getAll();
    expect(result.length).toBe(2);

    const ids = result.map(t => t.getId());
    expect(ids).toContain("t1");
    expect(ids).toContain("t2");
  });


  it("should update an existing toy", async () => {
    const toy = makeToy("toy-1");
    await repo.create(toy);

    const updatedToy = makeToy("toy-1");
    updatedToy.getBrand = () => "UpdatedBrand";

    await repo.update(updatedToy);

    const found = await repo.get("toy-1");
    expect(found.getBrand()).toBe("UpdatedBrand");
  });


  it("should delete an existing toy", async () => {
    const toy = makeToy("toy-1");
    await repo.create(toy);

    await repo.delete("toy-1");

    await expect(repo.get("toy-1"))
      .rejects
      .toBeInstanceOf(DbException);
  });


  it("should fail when creating duplicate ID", async () => {
    await repo.create(makeToy("toy-1"));

    await expect(repo.create(makeToy("toy-1")))
      .rejects
      .toThrow();
  });


  it("should fail when inserting invalid values", () => {
    const builder = new ToyBuilder()
      .setAgeGroup("5+")
      .setBrand("Brand")
      .setMaterial("Plastic")
      .setBatteryRequired(true)
      .setEducational(true);

    expect(() => builder.build()).toThrow("type is missing");
  });


  it("should rollback when a query in a transaction fails", async () => {
    const client = repo["client"];
    const toy = makeToy("toy-rollback");

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO toy (
          id, type, ageGroup, brand, material, batteryRequired, educational
        ) VALUES ($1,$2,$3,$4,$5,$6,$7);`,
        [
          toy.getId(),
          toy.getType(),
          toy.getAgeGroup(),
          toy.getBrand(),
          toy.getMaterial(),
          toy.getBatteryRequired(),
          toy.getEducational()
        ]
      );

      await client.query("INVALID SQL");

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
    }

    await expect(repo.get("toy-rollback"))
      .rejects
      .toBeInstanceOf(DbException);
  });
});
