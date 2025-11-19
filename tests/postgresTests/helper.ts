

// MADE TO CLEAN UP TESTS AND MAKE IT LESS REDUNDANT


import { CakeBuilder, IdentifiableCakeBuilder } from "../../src/model/builders/cake.builder";
import { BookBuilder, IdentifiableBookBuilder } from "../../src/model/builders/book.builder";
import { ToyBuilder, IdentifiableToyBuilder } from "../../src/model/builders/toy.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "../../src/model/builders/order.builder";

export function makeCake(id: string) {
  const cake = new CakeBuilder()
    .setType("Birthday")
    .setFlavor("Dark Chocolate")
    .setFilling("Cream")
    .setSize(8)
    .setLayers(2)
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Chocolate")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Red")
    .setCustomMessage("Happy Birthday")
    .setShape("Round")
    .setAllergies("None")
    .setSpecialIngredients("None")
    .setPackagingType("Box")
    .build();

  return IdentifiableCakeBuilder
    .newBuilder()
    .setId(id)
    .setCake(cake)
    .build();
}


export function makeBook(id: string) {
  const book = new BookBuilder()
    .setBookTitle("Test Book")
    .setAuthor("Test Author")
    .setGenre("Fantasy")
    .setFormat("Hardcover")
    .setLanguage("EN")
    .setPublisher("TestPub")
    .setSpecialEdition("None")
    .setPackaging("Box")
    .build();

  return IdentifiableBookBuilder
    .newBuilder()
    .setId(id)
    .setBook(book)
    .build();
}


export function makeToy(id: string) {
  const toy = new ToyBuilder()
    .setType("Action Figure")
    .setAgeGroup("5+")
    .setBrand("FunBrand")
    .setMaterial("Plastic")
    .setBatteryRequired(false)
    .setEducational(true)
    .build();

  return IdentifiableToyBuilder
    .newBuilder()
    .setId(id)
    .setToy(toy)
    .build();
}


export function makeCakeOrder(orderId: string, cakeId: string) {
  const cake = makeCake(cakeId);

  const order = OrderBuilder.newBuilder()
    .setId(orderId)
    .setItem(cake)
    .setQuantity(2)
    .setPrice(40)
    .build();

  return IdentifiableOrderItemBuilder.newBuilder()
    .setItem(cake)
    .setOrder(order)
    .build();
}

