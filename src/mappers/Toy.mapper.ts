import { IdentifiableToyBuilder, ToyBuilder } from "../model/builders/toy.builder";
import { IdentifiableToy, Toy } from "../model/Toy.model";
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

  reverseMap(toy: Toy): Record<string, string> {
    return {
      "Type": toy.getType(),
      "AgeGroup": toy.getAgeGroup(),
      "Brand": toy.getBrand(),
      "Material": toy.getMaterial(),
      "BatteryRequired": toy.getBatteryRequired() ? "Yes" : "No",
      "Educational": toy.getEducational() ? "Yes" : "No"
    };
  }

}

export interface SQLToy {
  id: string;
  type: string;
  ageGroup: string;
  brand: string;
  material: string;
  batteryRequired: boolean;
  educational: boolean;
}

export class SQLToyMapper implements IMapper<SQLToy, Toy> {

  map(row: SQLToy): IdentifiableToy {
    return IdentifiableToyBuilder.newBuilder()
            .setToy(ToyBuilder.newBuilder()
              .setType(row.type)
              .setAgeGroup(row.ageGroup)
              .setBrand(row.brand)
              .setMaterial(row.material)
              .setBatteryRequired(row.batteryRequired)
              .setEducational(row.educational)
              .build())
            .setId(row.id) 
            .build();
    
  }

  reverseMap(toy: IdentifiableToy): SQLToy {
    return {
      id: toy.getId(),
      type: toy.getType(),
      ageGroup: toy.getAgeGroup(),
      brand: toy.getBrand(),
      material: toy.getMaterial(),
      batteryRequired: toy.getBatteryRequired(),
      educational: toy.getEducational()
    };
  }
}