import { id, Initializable, IRepository } from "../../repository/IRepository";
import logger from "../../util/logger";
import { PGConnectionManager } from "./PGConnectionManager";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { IIdentifiableOrderItem } from "../../model/IOrder";
import { IIdentifiableItem } from "../../model/IItem";
import { IdentifiableOrderItem, Order } from "../../model/Order.model";
import { SQLiteOrder, SQLiteOrderMapper } from "../../mappers/Order.mapper";


const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "order" (
        "id" TEXT PRIMARY KEY,
        "quantity" INTEGER NOT NULL,
        "price" INTEGER NOT NULL,
        "item_category" TEXT NOT NULL,
        "item_id" TEXT NOT NULL
)`;

const INSERT_ORDER = `INSERT INTO "order" ("id", "quantity", "price", "item_category", "item_id") VALUES ($1, $2, $3, $4, $5)`;

export class PostgresOrderRepository implements IRepository <IIdentifiableOrderItem>, Initializable {
 
  constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & Initializable) {}
  
  private client = PGConnectionManager.getClient();
  
  async init(): Promise<void> {
    try {
      await this.client.query(`DROP TABLE IF EXISTS "order"`);
      await this.client.query(CREATE_TABLE);
      logger.info("Order table initialized (PostgreSQL)");
    } catch (error: unknown) {
      logger.error("Failed to initialize order table", error as Error);
      throw new InitializationException("Failed to initialize order table", error as Error);
    }
  }


  async create(order: IIdentifiableOrderItem): Promise<id> {
      try {
      await this.client.query("BEGIN");

      const item_id = await this.itemRepository.create(order.getItem());

      await this.client.query(INSERT_ORDER, [
        order.getId(),
        order.getQuantity(),
        order.getPrice(),
        order.getItem().getCategory(),
        item_id
      ]);

      await this.client.query("COMMIT");
        return order.getId();
      } catch (error) {
          await this.client.query("ROLLBACK");
          throw new DbException("Failed to create order", error as Error);
      }
  }


  async get(id: id): Promise<IdentifiableOrderItem> {
    try {
      const result = await this.client.query(
        `SELECT * FROM "order" WHERE id = $1`,
        [id]
      );

      const rows = Array.isArray(result) ? result : (result as any)?.rows;

      if (!rows || rows.length === 0) {
        throw new ItemNotFoundException("Order of id " + id + " not found");
      }

      const order = rows[0] as SQLiteOrder;

      const item = await this.itemRepository.get(order.item_id);

      return new SQLiteOrderMapper().map({ data: order, item });
    } catch (error) {
      throw new DbException("Failed to get order of id " + id, error as Error);
    }
  }


  async getAll(): Promise<IdentifiableOrderItem[]> {
    try {
      const result = await this.client.query(`SELECT * FROM "order"`);

      const rows = Array.isArray(result) ? result : result.rows;

      if (!rows || rows.length === 0) return [];

      const mapper = new SQLiteOrderMapper();

      const orders = await Promise.all(
        rows.map(async (row) => {
          const order = row as SQLiteOrder;

          const item = await this.itemRepository.get(order.item_id);

          return mapper.map({ data: order, item });
        })
      );

      return orders;
    } catch (error) {
      logger.error("Failed to get all orders", error as Error);
      throw new DbException("Failed to get all orders", error as Error);
    }
  }

  
  async update(order: IdentifiableOrderItem): Promise<void> {
  try {
    await this.client.query(
      `UPDATE "order"
       SET item_id = $1,
           quantity = $2
       WHERE id = $3`,
      [
        order.getItem().getId(),
        order.getQuantity(),
        order.getId()
      ]
    );
     } catch (error) {
        logger.error("Failed to update order %s: %o", order.getId(), error as Error);
        throw new DbException(
          "Failed to update order " + order.getId(),
          error as Error
        );
     }
  }

  async delete(id: id): Promise<void> {
    try {
      await this.client.query(
        `DELETE FROM "order" WHERE id = $1`,
        [id]
      );
    } catch (error) {
      logger.error("Failed to delete order %s: %o", id, error as Error);
      throw new DbException("Failed to delete order " + id, error as Error);
    }
  }

}