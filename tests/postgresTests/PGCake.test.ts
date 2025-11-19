import { PostgresCakeRepository } from "../../src/repository/postgreSQL/PGCake.order.repository";
import { PGConnectionManager } from "../../src/repository/postgreSQL/PGConnectionManager";
import dotenv from "dotenv";
import { makeCake } from "./helper";
import { DbException, ItemNotFoundException } from "../../src/util/exceptions/repositoryExceptions";
import { CakeBuilder, IdentifiableCakeBuilder } from "../../src/model/builders/cake.builder";

dotenv.config({ path: ".env.test" });

describe("PostgresCakeRepository CRUD", () => {
  let repo: PostgresCakeRepository;

  beforeAll(async () => {
    PGConnectionManager.getClient();
  });

  beforeEach(async () => {
    repo = new PostgresCakeRepository();
    await repo.init();

    const client = PGConnectionManager.getClient();
    await client.query(`DELETE FROM cake;`);
  });

  

  it("should create a new cake and retrieve it", async () => {
    const cake = makeCake("cake-1");
    const identifiableCake = IdentifiableCakeBuilder
    .newBuilder()
    .setId("cake-1")
    .setCake(cake)
    .build();

    const id = await repo.create(cake);
    expect(id).toBe("cake-1");

    const found = await repo.get("cake-1");
    expect(found.getId()).toBe("cake-1");
    expect(found.getFlavor()).toBe(cake.getFlavor());
  });


  it("should return all cakes", async () => {
    await repo.create(makeCake("c1"));
    await repo.create(makeCake("c2"));

    const result = await repo.getAll();

    expect(result.length).toBe(2);

    const ids = result.map(c => c.getId());
    expect(ids).toContain("c1");
    expect(ids).toContain("c2");
  });


  it("should update an existing cake", async () => {
    const cake = makeCake("cake-1");
    await repo.create(cake);

    const updatedCake = makeCake("cake-1");
    const newCakeFlavor = "Vanilla";
    
    updatedCake.getFlavor = () => newCakeFlavor;

    await repo.update(updatedCake);

    const found = await repo.get("cake-1");
    expect(found.getFlavor()).toBe(newCakeFlavor);
  });


  it("should delete an existing cake", async () => {
    const cake = makeCake("cake-1");
    await repo.create(cake);

    await repo.delete("cake-1");

    await expect(repo.get("cake-1"))
      .rejects
      .toBeInstanceOf(DbException);
  });


  it("should fail when creating duplicate ID", async () => {
    await repo.create(makeCake("cake-1"));

    await expect(repo.create(makeCake("cake-1")))
      .rejects
      .toThrow();
  });


  it("should fail when inserting invalid values", async () => {
    const builder = new CakeBuilder()
      .setFlavor("Dark Chocolate")
      .setFilling("Cream")
      .setSize(8)
      .setLayers(2)
      .setFrostingType("Buttercream")
      .setFrostingFlavor("Chocolate")
      .setDecorationType("Sprinkles")
      .setDecorationColor("Red")
      .setCustomMessage("Happy Birthday")
      .setShape("Round")
      .setAllergies("None")
      .setSpecialIngredients("None")
      .setPackagingType("Box");
    
    expect(() => builder.build()).toThrow("type is missing");
  });


  it("should rollback when one query in a transaction fails", async () => {
    const client = repo["client"];
    const cake = makeCake("cake-rollback");

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO cake (
          id, type, flavor, filling, size, layers, 
          frostingType, frostingFlavor, decorationType, decorationColor,
          customMessage, shape, allergies, specialIngredients, packagingType
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);`,
        [
          cake.getId(),
          cake.getType(),
          cake.getFlavor(),
          cake.getFilling(),
          cake.getSize(),
          cake.getLayers(),
          cake.getFrostingType(),
          cake.getFrostingFlavor(),
          cake.getDecorationType(),
          cake.getDecorationColor(),
          cake.getCustomMessage(),
          cake.getShape(),
          cake.getAllergies(),
          cake.getSpecialIngredients(),
          cake.getPackagingType()
        ]
      );

      await client.query("INVALID SQL SYNTAX");

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
    }

    await expect(repo.get("cake-rollback"))
      .rejects
      .toBeInstanceOf(DbException);
  });
});
