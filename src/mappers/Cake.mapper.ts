import { CakeBuilder } from "../model/builders/cake.builder";
import { Cake } from "../model/Cake.model";
import { IMapper } from "./IMapper";

export class CSVCakeMapper implements IMapper<string[], Cake> {
  map(data: string[]): Cake {
      return CakeBuilder.newBuilder()
                 .setType(data[1])
                 .setFlavor(data[2])
                 .setFilling(data[3])
                 .setSize(parseInt(data[4]))
                 .setLayers(parseInt(data[5]))
                 .setFrostingType(data[6])
                 .setFrostingFlavor(data[7])
                 .setDecorationType(data[8])
                 .setDecorationColor(data[9])
                 .setCustomMessage(data[10])
                 .setShape(data[11])
                 .setAllergies(data[12])
                 .setSpecialIngredients(data[13])
                 .setPackagingType(data[14])
                 .build();
  }
}