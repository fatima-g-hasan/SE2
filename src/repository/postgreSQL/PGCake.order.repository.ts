import { IdentifiableCake } from "../../model/Cake.model";
import { id, Initializable, IRepository } from "../IRepository";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import logger from "../../util/logger";
import { PGConnectionManager } from "./PGConnectionManager";
import { ItemCategory } from "../../model/IItem";
import { SQLiteCake, SQLiteCakeMapper } from "../../mappers/Cake.mapper"; 

const tableName = ItemCategory.CAKE;

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
   "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "flavor" TEXT NOT NULL,
    "filling" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "layers" INTEGER NOT NULL,
    "frostingType" TEXT NOT NULL,
    "frostingFlavor" TEXT NOT NULL,
    "decorationType" TEXT NOT NULL,
    "decorationColor" TEXT NOT NULL,
    "customMessage" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "allergies" TEXT NOT NULL,
    "specialIngredients" TEXT NOT NULL,
    "packagingType" TEXT NOT NULL
  )
`;

const INSERT_CAKE = `
  INSERT INTO ${tableName} (
    "id", "type", "flavor", "filling", "size", "layers", 
    "frostingType", "frostingFlavor", "decorationType", "decorationColor",
    "customMessage", "shape", "allergies", "specialIngredients", "packagingType"
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
  )
`;

const UPDATE = `
  UPDATE ${tableName}
  SET 
    "type" = $1, "flavor" = $2, "filling" = $3, "size" = $4, "layers" = $5,
    "frostingType" = $6, "frostingFlavor" = $7, "decorationType" = $8,
    "decorationColor" = $9, "customMessage" = $10, "shape" = $11,
    "allergies" = $12, "specialIngredients" = $13, "packagingType" = $14
  WHERE id = $15
`;

export class PostgresCakeRepository implements IRepository<IdentifiableCake>, Initializable {
  private client = PGConnectionManager.getClient();

  async init(): Promise<void> {
    try {
      await this.client.query(`DROP TABLE IF EXISTS ${tableName};`);
      await this.client.query(CREATE_TABLE);
      logger.info("Cake table initialized (PostgreSQL)");
    } catch (error: unknown) {
      logger.error("Failed to initialize Cake table", error as Error);
      throw new InitializationException("Failed to initialize Cake table", error as Error);
    }
  }

  async create(item: IdentifiableCake): Promise<id> {
    try {
      await this.client.query(INSERT_CAKE, [
        item.getId(),
        item.getType(),
        item.getFlavor(),
        item.getFilling(),
        item.getSize(),
        item.getLayers(),
        item.getFrostingType(),
        item.getFrostingFlavor(),
        item.getDecorationType(),
        item.getDecorationColor(),
        item.getCustomMessage(),
        item.getShape(),
        item.getAllergies(),
        item.getSpecialIngredients(),
        item.getPackagingType()
      ]);
      return item.getId();
    } catch (error: unknown) {
      throw new DbException("Failed to create cake", error as Error);
    }
  }


  async get(id: id): Promise<IdentifiableCake> {
    try {
      const result = (await this.client.query(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id]
      )) as Record<string, any>[];

      if (!result || result.length === 0) {
        throw new ItemNotFoundException("Cake of id " + id + " not found");
      }

      const cake = result[0] as SQLiteCake;
      return new SQLiteCakeMapper().map(cake);
    } catch (error) {
      throw new DbException("Failed to get cake of id " + id, error as Error);
    }
  }


  async getAll(): Promise<IdentifiableCake[]> {
    try {
      const result = (await this.client.query(
        `SELECT * FROM ${tableName}`
      )) as Record<string, any>[];

      if (!result || result.length === 0) return [];

      const mapper = new SQLiteCakeMapper();
      return result.map((cake) => mapper.map(cake as SQLiteCake));
    } catch (error) {
      logger.error("Failed to get all cakes", error as Error);
      throw new DbException("Failed to get all cakes", error as Error);
    }
  }


  async update(item: IdentifiableCake): Promise<void> {
    try {
      await this.client.query(UPDATE, [
        item.getType(),
        item.getFlavor(),
        item.getFilling(),
        item.getSize(),
        item.getLayers(),
        item.getFrostingType(),
        item.getFrostingFlavor(),
        item.getDecorationType(),
        item.getDecorationColor(),
        item.getCustomMessage(),
        item.getShape(),
        item.getAllergies(),
        item.getSpecialIngredients(),
        item.getPackagingType(),
        item.getId()
      ]);
    } catch (error) {
      logger.error("Failed to update cake of id %s %o", item.getId(), error as Error);
      throw new DbException("Failed to update cake of id " + item.getId(), error as Error);
    }
  }


  async delete(id: id): Promise<void> {
    try {
      await this.client.query(
        `DELETE FROM ${tableName} WHERE id = $1`,
        [id]
      );
    } catch (error) {
      logger.error("Failed to delete cake of id %s %o", id, error as Error);
      throw new DbException("Failed to delete cake of id " + id, error as Error);
    }
  }
}
