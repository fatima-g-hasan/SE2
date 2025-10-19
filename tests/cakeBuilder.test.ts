import { CakeBuilder } from "../src/model/builders/cake.builder";
import { Cake } from "../src/model/Cake.model";

describe("CakeBuilder", () => {
  it("should build a Cake object when all properties are correct", () => {
    const cake = new CakeBuilder()
      .setType("Birthday Cake")
      .setFlavor("Chocolate")
      .setFilling("Strawberry")
      .setSize(8)
      .setLayers(2)
      .setFrostingType("Buttercream")
      .setFrostingFlavor("Vanilla")
      .setDecorationType("Sprinkles")
      .setDecorationColor("Rainbow")
      .setCustomMessage("Happy Birthday!")
      .setShape("Round")
      .setAllergies("None")
      .setSpecialIngredients("Gluten-free flour")
      .setPackagingType("Box")
      .build();

    expect(cake).toBeInstanceOf(Cake);
    expect(cake.getSize()).toBe(8);
  });

  it("should throw an error if a required property is missing", () => {
    const builder = new CakeBuilder()
      .setType("Birthday Cake")
      .setFlavor("Chocolate");

    expect(() => builder.build()).toThrow();
  });

  it("should throw an error if a property has incorrect data type", () => {
    const builder: any = new CakeBuilder();
    builder.setSize(2);
    builder.setLayers("hello")
      .setType("Birthday Cake")
      .setFlavor("Chocolate")
      .setFilling("Strawberry")
      .setFrostingType("Buttercream")
      .setFrostingFlavor("Vanilla")
      .setDecorationType("Sprinkles")
      .setDecorationColor("Rainbow")
      .setCustomMessage("Hi")
      .setShape("Round")
      .setAllergies("None")
      .setSpecialIngredients("Sugar")
      .setPackagingType("Box");

    expect(() => builder.build()).toThrow();
  });
});
