import {XMLToyMapper} from "../src/mappers/Toy.mapper";
import { Toy } from "../src/model/Toy.model";

describe("XMLToyMapper", () => {
    let mapper: XMLToyMapper;
  
    beforeEach(() => {
      mapper = new XMLToyMapper();
    })

    it("should correctly map valid XML data to a Toy object", () => {
      const data = {
      Type: "Action Figure",
      AgeGroup: "5-10",
      Brand: "Hasbro",
      Material: "Plastic",
      BatteryRequired: "Yes",
      Educational: "No"
    };
    const toy = mapper.map(data);

    expect(toy).toBeInstanceOf(Toy);
    expect(toy.getType()).toBe("Action Figure");
    expect(toy.getAgeGroup()).toBe("5-10");
    expect(toy.getBrand()).toBe("Hasbro");
    expect(toy.getMaterial()).toBe("Plastic");
    expect(toy.getBatteryRequired()).toBe(true);
    expect(toy.getEducational()).toBe(false);
  });

  it("should throw an error when required fields are missing", () => {
    const data = {
      Type: "Puzzle",
      AgeGroup: "3-6",
      Brand: "LEGO"
    };

    expect(() => mapper.map(data)).toThrow();
  });

  it("should throw an error for invalid data types", () => {
    const data = {
      Type: 123 as any,
      AgeGroup: true as any,
      Brand: "Mattel",
      Material: "Wood",
      BatteryRequired: "Yes",
      Educational: "No"
    };

    expect(() => mapper.map(data)).toThrow();
  });

  it("should correctly handle boolean-like strings for battery and educational fields", () => {
    const data = {
      Type: "Robot",
      AgeGroup: "8-12",
      Brand: "Sony",
      Material: "Metal",
      BatteryRequired: "No",
      Educational: "Yes"
    };

    const toy = mapper.map(data);

    expect(toy.getBatteryRequired()).toBe(false);
    expect(toy.getEducational()).toBe(true);
  });
});
