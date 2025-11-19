import { BookBuilder, IdentifiableBookBuilder } from "../model/builders/book.builder";
import { Book, IdentifiableBook } from "../model/Book.model";
import { IMapper } from "./IMapper";

export class JSONBookMapper implements IMapper<Record<string, string>, Book> {
  map(data: Record<string, string>): Book {
    return BookBuilder.newBuilder()
                      .setBookTitle(data["Book Title"])
                      .setAuthor(data["Author"])
                      .setGenre(data["Genre"])
                      .setFormat(data["Format"])
                      .setLanguage(data["Language"])
                      .setPublisher(data["Publisher"])
                      .setSpecialEdition(data["Special Edition"])
                      .setPackaging(data["Packaging"])
                      .build();
  }


   reverseMap(book: Book): Record<string, string> {
    return {
      "Book Title": book.getBookTitle(),
      "Author": book.getAuthor(),
      "Genre": book.getGenre(),
      "Format": book.getFormat(),
      "Language": book.getLanguage(),
      "Publisher": book.getPublisher(),
      "Special Edition": book.getSpecialEdition(),
      "Packaging": book.getPackaging()
    };
  }
}

export interface SQLBook {
  id: string;
  bookTitle: string;
  author: string;
  genre: string;
  format: string;
  language: string;
  publisher: string;
  specialEdition: string;
  packaging: string;
}

export class SQLBookMapper implements IMapper<SQLBook, IdentifiableBook> {

  map(data: SQLBook): IdentifiableBook {
    return IdentifiableBookBuilder.newBuilder()
              .setBook(BookBuilder.newBuilder()
                .setBookTitle(data.bookTitle)
                .setAuthor(data.author)
                .setGenre(data.genre)
                .setFormat(data.format)
                .setLanguage(data.language)
                .setPublisher(data.publisher)
                .setSpecialEdition(data.specialEdition)
                .setPackaging(data.packaging)
                .build())
              .setId(data.id)
              .build(); 
    
  }

  reverseMap(book: IdentifiableBook): SQLBook {
    return {
      id: book.getId(),
      bookTitle: book.getBookTitle(),
      author: book.getAuthor(),
      genre: book.getGenre(),
      format: book.getFormat(),
      language: book.getLanguage(),
      publisher: book.getPublisher(),
      specialEdition: book.getSpecialEdition(),
      packaging: book.getPackaging()
    };
  }
}
