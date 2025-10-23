import { CakeBuilder } from "model/builders/cake.builder";
import { BookBuilder } from "model/builders/book.builder";
import { ToyBuilder } from "model/builders/toy.builder";

// CAKE
export async function createCake() {
  const cakeBuilder = new CakeBuilder();
  const cake = cakeBuilder
    .setType("type")
    .setFlavor("flavor")
    .setFilling("filling")
    .setSize(10)
    .setLayers(2)
    .setFrostingType("frostingType")
    .setFrostingFlavor("frostingFlavor")
    .setDecorationType("decorationType")
    .setDecorationColor("decorationColor")
    .setCustomMessage("customMessage")
    .setShape("shape")
    .setAllergies("allergies")
    .setSpecialIngredients("specialIngredients")
    .setPackagingType("packagingType")
    .build();

  console.log(cake);
}


// BOOK
export async function createBook() {
  const bookBuilder = new BookBuilder();
  const book = bookBuilder
    .setBookTitle("bookTitle")
    .setAuthor("author")
    .setGenre("genre")
    .setFormat("format")
    .setLanguage("language")
    .setPublisher("publisher")
    .setSpecialEdition("specialEdition")
    .setPackaging("packaging")
    .build();

  console.log(book);
}


// TOY
export async function createToy() {
  const toyBuilder = new ToyBuilder();
  const toy = toyBuilder
    .setType("type")
    .setAgeGroup("ageGroup")
    .setBrand("brand")
    .setMaterial("material")
    .setBatteryRequired(false)
    .setEducational(true)
    .build();

  console.log(toy);
}
