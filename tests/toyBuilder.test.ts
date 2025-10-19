import { ToyBuilder } from "../src/model/builders/toy.builder";
import { Toy } from "../src/model/Toy.model";

describe("ToyBuilder", () => {
  it("should build a Toy object when all properties are correct", () => {
    const toy = new ToyBuilder()
      .setType("Action Figure")
      .setAgeGroup("6+")
      .setBrand("Hasbro")
      .setMaterial("Plastic")
      .setBatteryRequired(true)
      .setEducational(false)
      .build();

    expect(toy).toBeInstanceOf(Toy);
    expect(toy.getBrand()).toBe("Hasbro");
    expect(toy.getBatteryRequired()).toBe(true);
  });

  it("should throw an error if a required property is missing", () => {
    const builder = new ToyBuilder()
      .setType("Puzzle")
      .setAgeGroup("3+");

    expect(() => builder.build()).toThrow();
  });

  it("should throw an error if a property has incorrect data type", () => {
    const builder: any = new ToyBuilder();
    builder
      .setType("Puzzle")
      .setAgeGroup("3+")
      .setBrand("Ravensburger")
      .setMaterial("Wood")
      .setBatteryRequired("Yes")
      .setEducational(false);

    expect(() => builder.build()).toThrow();
  });
});
