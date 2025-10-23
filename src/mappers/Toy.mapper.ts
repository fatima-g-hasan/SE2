import { ToyBuilder } from "../model/builders/toy.builder";
import { Toy } from "../model/Toy.model";
import { IMapper } from "./IMapper";

export class XMLToyMapper implements IMapper<Record<string, string>, Toy> {
  map(row: Record<string, string>): Toy {
    return ToyBuilder.newBuilder()
                    .setType(row["Type"])
                    .setAgeGroup(row["AgeGroup"])
                    .setBrand(row["Brand"])
                    .setMaterial(row["Material"])
                    .setBatteryRequired(row["BatteryRequired"] === "Yes")
                    .setEducational(row["Educational"] === "Yes")
                    .build();
  }
}