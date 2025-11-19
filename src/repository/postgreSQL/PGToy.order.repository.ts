import { id, Initializable, IRepository } from "../IRepository";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import logger from "../../util/logger";
import { PGConnectionManager } from "./PGConnectionManager";
import { ItemCategory } from "../../model/IItem";
import { IdentifiableToy } from "../../model/Toy.model";
import { SQLToy, SQLToyMapper } from "../../mappers/Toy.mapper";

const tableName = ItemCategory.TOY;

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "batteryRequired" BOOLEAN NOT NULL,
    "educational" BOOLEAN NOT NULL
  );
`;

const INSERT_TOY = `
  INSERT INTO ${tableName} (
    "id", "type", "ageGroup", "brand", "material", "batteryRequired", 
    "educational"
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7
  );
`;

const UPDATE = `
  UPDATE ${tableName}
  SET 
    "type" = $1, "ageGroup" = $2, "brand" = $3, "material" = $4,
    "batteryRequired" = $5, "educational" = $6
  WHERE id = $7;
`;

export class PostgresToyRepository implements IRepository<IdentifiableToy>, Initializable {
  private client = PGConnectionManager.getClient();

  async init(): Promise<void> {
    try {
      await this.client.query(`DROP TABLE IF EXISTS ${tableName};`);
      await this.client.query(CREATE_TABLE);
      logger.info("Toy table initialized (PostgreSQL)");
    } catch (error: unknown) {
      logger.error("Failed to initialize Toy table", error as Error);
      throw new InitializationException("Failed to initialize Toy table", error as Error);
    }
  }

  async create(item: IdentifiableToy): Promise<id> {
    try {
      await this.client.query(INSERT_TOY, [
        item.getId(),
        item.getType(),
        item.getAgeGroup(),
        item.getBrand(),
        item.getMaterial(),
        item.getBatteryRequired(),
        item.getEducational()
      ]);
      return item.getId();
    } catch (error: unknown) {
      throw new DbException("Failed to create toy", error as Error);
    }
  }


  async get(id: id): Promise<IdentifiableToy> {
    try {
      const result = (await this.client.query(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id]
      )) as Record<string, any>[];

      if (!result || result.length === 0) {
        throw new ItemNotFoundException("Toy of id " + id + " not found");
      }

      const toy = result[0] as SQLToy;
      return new SQLToyMapper().map(toy);
    } catch (error) {
      throw new DbException("Failed to get book of id " + id, error as Error);
    }
  }


  async getAll(): Promise<IdentifiableToy[]> {
    try {
      const result = (await this.client.query(
        `SELECT * FROM ${tableName}`
      )) as Record<string, any>[];

      if (!result || result.length === 0) return [];

      const mapper = new SQLToyMapper();
      return result.map((toy) => mapper.map(toy as SQLToy));
    } catch (error) {
      logger.error("Failed to get all toys", error as Error);
      throw new DbException("Failed to get all toys", error as Error);
    }
  }


  async update(item: IdentifiableToy): Promise<void> {
    try {
      await this.client.query(UPDATE, [
        item.getType(),             
        item.getAgeGroup(),         
        item.getBrand(),            
        item.getMaterial(),         
        item.getBatteryRequired(),  
        item.getEducational(),      
        item.getId()           
      ]);
    } catch (error) {
      logger.error("Failed to update toy of id %s %o", item.getId(), error as Error);
      throw new DbException("Failed to update toy of id " + item.getId(), error as Error);
    }
  }

  
  async delete(id: id): Promise<void> {
    try {
      await this.client.query(
        `DELETE FROM ${tableName} WHERE id = $1`,
        [id]
      );
    } catch (error) {
      logger.error("Failed to delete toy of id %s %o", id, error as Error);
      throw new DbException("Failed to delete toy of id " + id, error as Error);
    }
  }
}
