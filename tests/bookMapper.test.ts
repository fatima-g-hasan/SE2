import { JSONBookMapper } from "../src/mappers/Book.mapper";
import { Book } from "../src/model/Book.model";

describe("JSONBookMapper", () => {
  let mapper: JSONBookMapper;

  beforeEach(() => {
    mapper = new JSONBookMapper();
  });

  it("should correctly map valid JSON data to a Book object", () => {
    const data = {
      "Book Title": "The Great Gatsby",
      "Author": "F. Scott Fitzgerald",
      "Genre": "Classic",
      "Format": "Hardcover",
      "Language": "English",
      "Publisher": "Scribner",
      "Special Edition": "Yes",
      "Packaging": "Box"
    };

    const book = mapper.map(data);

    expect(book).toBeInstanceOf(Book);
    expect(book.getBookTitle()).toBe("The Great Gatsby");
    expect(book.getAuthor()).toBe("F. Scott Fitzgerald");
    expect(book.getGenre()).toBe("Classic");
    expect(book.getFormat()).toBe("Hardcover");
    expect(book.getLanguage()).toBe("English");
    expect(book.getPublisher()).toBe("Scribner");
    expect(book.getSpecialEdition()).toBe("Yes");
    expect(book.getPackaging()).toBe("Box");
  });

  it("should handle missing fields gracefully", () => {
    const data = {
      "Book Title": "1984",
      "Author": "George Orwell",
      "Genre": "Dystopian"
    };

    expect(() => mapper.map(data)).toThrow("format is missing");
  });

  it("should throw an error for invalid data types", () => {
    const data = {
      "Book Title": 123 as any,
      "Author": true as any,
      "Genre": "Fantasy",
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Penguin",
      "Special Edition": "No",
      "Packaging": "Plastic"
    };

    expect(() => mapper.map(data)).toThrow();
  });
});
