import { BookBuilder } from "../src/model/builders/book.builder";
import { Book } from "../src/model/Book.model";

describe("BookBuilder", () => {
  it("should build a Book object when all properties are correct", () => {
    const book = new BookBuilder()
      .setBookTitle("The Great Gatsby")
      .setAuthor("F. Scott Fitzgerald")
      .setGenre("Fiction")
      .setFormat("Hardcover")
      .setLanguage("English")
      .setPublisher("Scribner")
      .setSpecialEdition("Anniversary")
      .setPackaging("Box")
      .build();

    expect(book).toBeInstanceOf(Book);
    expect(book.getAuthor()).toBe("F. Scott Fitzgerald");
  });

  it("should throw an error if a required property is missing", () => {
    const builder = new BookBuilder()
      .setBookTitle("1984")
      .setAuthor("George Orwell");


    expect(() => builder.build()).toThrow();
  });

  it("should throw an error if a property has incorrect data type", () => {
    const builder: any = new BookBuilder();
    builder
      .setBookTitle("1984")
      .setAuthor("George Orwell")
      .setGenre("Dystopian")
      .setFormat("Paperback")
      .setLanguage("English")
      .setPublisher("Secker & Warburg")
      .setSpecialEdition("Special")
      .setPackaging(123);

    expect(() => builder.build()).toThrow();
  });
});
