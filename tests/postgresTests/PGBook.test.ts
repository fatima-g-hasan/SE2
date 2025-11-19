import { PostgresBookRepository } from "../../src/repository/postgreSQL/PGBook.order.repository";
import { PGConnectionManager } from "../../src/repository/postgreSQL/PGConnectionManager";
import dotenv from "dotenv";
import { makeBook } from "./helper";
import { DbException, ItemNotFoundException } from "../../src/util/exceptions/repositoryExceptions";
import { BookBuilder } from "../../src/model/builders/book.builder";

dotenv.config({ path: ".env.test" });

describe("PostgresBookRepository CRUD", () => {
  let repo: PostgresBookRepository;

  beforeAll(async () => {
    PGConnectionManager.getClient();
  });

  beforeEach(async () => {
    repo = new PostgresBookRepository();
    await repo.init();

    const client = PGConnectionManager.getClient();
    await client.query(`DELETE FROM book;`);
  });


  it("should create a new book and retrieve it", async () => {
    const book = makeBook("book-1");

    const id = await repo.create(book);
    expect(id).toBe("book-1");

    const found = await repo.get("book-1");
    expect(found.getId()).toBe("book-1");
    expect(found.getAuthor()).toBe(book.getAuthor());
  });


  it("should return all books", async () => {
    await repo.create(makeBook("b1"));
    await repo.create(makeBook("b2"));

    const result = await repo.getAll();

    expect(result.length).toBe(2);

    const ids = result.map(b => b.getId());
    expect(ids).toContain("b1");
    expect(ids).toContain("b2");
  });


  it("should update an existing book", async () => {
    const book = makeBook("book-1");
    await repo.create(book);

    const updated = makeBook("book-1");
    updated.getAuthor = () => "Updated Author";

    await repo.update(updated);

    const found = await repo.get("book-1");
    expect(found.getAuthor()).toBe("Updated Author");
  });


  it("should delete an existing book", async () => {
    const book = makeBook("book-1");
    await repo.create(book);

    await repo.delete("book-1");

    await expect(repo.get("book-1"))
      .rejects
      .toBeInstanceOf(DbException);
  });


  it("should fail when creating duplicate ID", async () => {
    await repo.create(makeBook("book-1"));

    await expect(repo.create(makeBook("book-1")))
      .rejects
      .toThrow();
  });


  it("should fail when inserting invalid values", async () => {
    const builder = new BookBuilder()
      .setAuthor("Author")
      .setGenre("Fantasy")
      .setFormat("Hardcover")
      .setLanguage("EN")
      .setPublisher("Pub")
      .setSpecialEdition("None")
      .setPackaging("Plastic");

    expect(() => builder.build()).toThrow("bookTitle is missing");
  });


  it("should rollback when a query in a transaction fails", async () => {
    const client = repo["client"];
    const book = makeBook("book-rollback");

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO book (
          id, bookTitle, author, genre, format, language, 
          publisher, specialEdition, packaging
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,
        [
          book.getId(),
          book.getBookTitle(),
          book.getAuthor(),
          book.getGenre(),
          book.getFormat(),
          book.getLanguage(),
          book.getPublisher(),
          book.getSpecialEdition(),
          book.getPackaging()
        ]
      );

      await client.query("INVALID SQL");

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
    }

    await expect(repo.get("book-rollback"))
      .rejects
      .toBeInstanceOf(DbException);
  });

});
