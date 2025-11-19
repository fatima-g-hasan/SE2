import logger from "../../util/logger";
import { Book, IdentifiableBook } from "../Book.model";


export class BookBuilder {
  private bookTitle!: string;
  private author!: string;
  private genre!: string;
  private format!: string;
  private language!: string;
  private publisher!: string;
  private specialEdition!: string;
  private packaging!: string;

  public static newBuilder(): BookBuilder {
    return new BookBuilder();
  }

  static fromExisting(book: IdentifiableBook): BookBuilder {
  return BookBuilder.newBuilder()
    .setBookTitle(book.getBookTitle())
    .setAuthor(book.getAuthor())
    .setGenre(book.getGenre())
    .setFormat(book.getFormat())
    .setLanguage(book.getLanguage())
    .setPublisher(book.getPublisher())
    .setSpecialEdition(book.getSpecialEdition())
    .setPackaging(book.getPackaging());
  }


  setBookTitle(bookTitle: string): BookBuilder {
    this.bookTitle = bookTitle;
    return this;
  }

  setAuthor(author: string): BookBuilder {
    this.author = author;
    return this;
  }

  setGenre(genre: string): BookBuilder {
    this.genre = genre;
    return this;
  }

  setFormat(format: string): BookBuilder {
    this.format = format;
    return this;
  }

  setLanguage(language: string): BookBuilder {
    this.language = language;
    return this;
  }

  setPublisher(publisher: string): BookBuilder {
    this.publisher = publisher;
    return this;
  }

  setSpecialEdition(specialEdition: string): BookBuilder {
    this.specialEdition = specialEdition;
    return this;
  }

  setPackaging(packaging: string): BookBuilder {
    this.packaging = packaging;
    return this;
  }

  build(): Book {
    const requiredProperties = {
      bookTitle: "string",
      author: "string",
      genre: "string",
      format: "string",
      language: "string",
      publisher: "string",
      specialEdition: "string",
      packaging: "string"
  };

     for (const [prop, type] of Object.entries(requiredProperties)) {
      const value = (this as any)[prop];
      if (value === undefined || value === null) {
        throw new Error(`${prop} is missing`);
      }
      if (typeof value !== type) {
        throw new Error(`${prop} must be a ${type}`);
      }
    }

    return new Book(
      this.bookTitle,
      this.author,
      this.genre,
      this.format,
      this.language,
      this.publisher,
      this.specialEdition,
      this.packaging
    );
  }
}

export class IdentifiableBookBuilder {
  private id!: string;
  private book!: Book;

  static newBuilder(): IdentifiableBookBuilder {
    return new IdentifiableBookBuilder();
  }

  setId(id: string): IdentifiableBookBuilder {
    this.id = id;
    return this;
  }

  setBook(book: Book): IdentifiableBookBuilder {
    this.book = book;
    return this;
  }

  build(): IdentifiableBook {
    if (!this.id || !this.book) {
      logger.error("Missing required properties, could not build an identiable book");
      throw new Error("Missing required properties");
    }
    return new IdentifiableBook(
      this.id,
      this.book.getBookTitle(),
      this.book.getAuthor(),
      this.book.getGenre(),
      this.book.getFormat(),
      this.book.getLanguage(),
      this.book.getPublisher(),
      this.book.getSpecialEdition(),
      this.book.getPackaging(),
    );
  }
}
