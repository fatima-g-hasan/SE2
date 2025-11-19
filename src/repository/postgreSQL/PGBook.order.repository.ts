import { Book, IdentifiableBook } from "../../model/Book.model";
import { id, Initializable, IRepository } from "../IRepository";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import logger from "../../util/logger";
import { PGConnectionManager } from "./PGConnectionManager";
import { ItemCategory } from "../../model/IItem";
import { SQLBook, SQLBookMapper } from "../../mappers/Book.mapper";

const tableName = ItemCategory.BOOK;

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    "id" TEXT PRIMARY KEY,
    "bookTitle" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "specialEdition" TEXT NOT NULL,
    "packaging" TEXT NOT NULL
  );
`;

const INSERT_BOOK = `
  INSERT INTO ${tableName} (
    "id", "bookTitle", "author", "genre", "format", "language", 
    "publisher", "specialEdition", "packaging"
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
  );
`;

const UPDATE = `
  UPDATE ${tableName}
  SET 
    "bookTitle" = $1, "author" = $2, "genre" = $3, "format" = $4, "language" = $5,
    "publisher" = $6, "specialEdition" = $7, "packaging" = $8
  WHERE id = $9;
`;

export class PostgresBookRepository implements IRepository<IdentifiableBook>, Initializable {
  private client = PGConnectionManager.getClient();

  async init(): Promise<void> {
    try {
      await this.client.query(`DROP TABLE IF EXISTS ${tableName};`);
      await this.client.query(CREATE_TABLE);
      logger.info("Book table initialized (PostgreSQL)");
    } catch (error: unknown) {
      logger.error("Failed to initialize Book table", error as Error);
      throw new InitializationException("Failed to initialize Book table", error as Error);
    }
  }


  async create(item: IdentifiableBook): Promise<id> {
    try {
      await this.client.query(INSERT_BOOK, [
        item.getId(),
        item.getBookTitle(),
        item.getAuthor(),
        item.getGenre(),
        item.getFormat(),
        item.getLanguage(),
        item.getPublisher(),
        item.getSpecialEdition(),
        item.getPackaging(),
      ]);
      return item.getId();
    } catch (error: unknown) {
      throw new DbException("Failed to create book", error as Error);
    }
  }


  async get(id: id): Promise<IdentifiableBook> {
    try {
      const result = (await this.client.query(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id]
      )) as Record<string, any>[];

      if (!result || result.length === 0) {
        throw new ItemNotFoundException("Book of id " + id + " not found");
      }

      const book = result[0] as SQLBook;
      return new SQLBookMapper().map(book);
    } catch (error) {
      throw new DbException("Failed to get book of id " + id, error as Error);
    }
  }


  async getAll(): Promise<IdentifiableBook[]> {
    try {
      const result = (await this.client.query(
        `SELECT * FROM ${tableName}`
      )) as Record<string, any>[];

      if (!result || result.length === 0) return [];

      const mapper = new SQLBookMapper();
      return result.map((book) => mapper.map(book as SQLBook));
    } catch (error) {
      logger.error("Failed to get all books", error as Error);
      throw new DbException("Failed to get all books", error as Error);
    }
  }


  async update(item: IdentifiableBook): Promise<void> {
    try {
      await this.client.query(UPDATE, [
        item.getBookTitle(),
        item.getAuthor(),
        item.getGenre(),
        item.getFormat(),
        item.getLanguage(),
        item.getPublisher(),
        item.getSpecialEdition(),
        item.getPackaging(),
        item.getId()
      ]);
    } catch (error) {
      logger.error("Failed to update book of id %s %o", item.getId(), error as Error);
      throw new DbException("Failed to update book of id " + item.getId(), error as Error);
    }
  }

  
  async delete(id: id): Promise<void> {
    try {
      await this.client.query(
        `DELETE FROM ${tableName} WHERE id = $1`,
        [id]
      );
    } catch (error) {
      logger.error("Failed to delete book of id %s %o", id, error as Error);
      throw new DbException("Failed to delete book of id " + id, error as Error);
    }
  }
}
