import { id, Initializable, IRepository } from "../IRepository";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import logger from "../../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { ItemCategory } from "../../model/IItem";
import { IdentifiableBook } from "../../model/Book.model";
import { IdentifiableToy } from "../../model/Toy.model";
import { SQLToy, SQLToyMapper } from "../../mappers/Toy.mapper";


const tableName = ItemCategory.TOY;
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    ageGroup TEXT NOT NULL,
    brand TEXT NOT NULL,
    material TEXT NOT NULL,
    batteryRequired BOOLEAN NOT NULL
    educational BOOLEAN NOT NULL
    )`;

const INSERT_TOY = `INSERT INTO ${tableName} (
    id, type, ageGroup, brand, material, batteryRequired,
    educational
      ) Values (?, ?, ?, ?, ?, ?, ?)`;

const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = ?`;

const SELECT_ALL = `SELECT * FROM ${tableName}`;

const DELETE_ID = `DELETE FROM ${tableName} WHERE id = ?`;

const UPDATE_ID = `UPDATE ${tableName} SET
  type = ?, ageGroup = ?, brand = ?, material = ?, batteryRequired = ?,
  educational = ?
  WHERE id = ?`;


export class ToyRepository implements IRepository<IdentifiableToy>, Initializable{

  async init(): Promise<void> {
    try {
      const conn = await ConnectionManager.getConnection();
      await conn.exec(CREATE_TABLE);
      logger.info("Toy table initialized");
      }
      catch (error: unknown) {
        logger.error("Failed to initialize Toy table", error as Error);
        throw new InitializationException("Failed to initialize Toy table", error as Error)
      }
  }

  async create(item: IdentifiableToy): Promise<id> {
    
    try {
      const conn = await ConnectionManager.getConnection();
      conn.run(INSERT_TOY, [
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
      const conn = await ConnectionManager.getConnection();
      const result = await conn.get<SQLToy>(SELECT_BY_ID, id);
      if (!result) {
        throw new ItemNotFoundException("Toy of id "+ id + " not found");
      }
      return new SQLToyMapper().map(result);
    } catch (error) {
      logger.error("Failed to get toy of id %s %o", id, error as Error);
      throw new DbException("Failed to get toy of id"+ id, error as Error);
    }
  }

  async getAll(): Promise<IdentifiableToy[]> {
     try {
        const conn = await ConnectionManager.getConnection();
        const result = await conn.all<SQLToy[]>(SELECT_ALL);
        const mapper = new SQLToyMapper();
        return result.map((toy) => mapper.map(toy));
    } catch (error) {
        logger.error("Failed to get all toys");
        throw new DbException("Failed to get all toys", error as Error);
    }
  }

  async update(item: IdentifiableToy): Promise<void> {
    try {
      const conn = await ConnectionManager.getConnection();
      await conn.run(UPDATE_ID, [
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
      throw new DbException("Failed to update toy of id"+ item.getId(), error as Error);
    }
  }

  async delete(id: id): Promise<void> {
     try {
        const conn = await ConnectionManager.getConnection();
        await conn.run(DELETE_ID, id);
    } catch (error) {
        logger.error("Failed to delete toy of id %s %o", id, error as Error);
        throw new DbException("Failed to delete toy of id"+ id, error as Error);
    }
  }
}
