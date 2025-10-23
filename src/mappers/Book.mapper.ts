import { BookBuilder } from "../model/builders/book.builder";
import { Book } from "../model/Book.model";
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
}
