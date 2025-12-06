import { ItemCategory } from "../model/IItem";
import { IMapper } from "./IMapper";
import { JsonCakeRequestMapper } from "./Cake.mapper";
import { JsonRequestOrderMapper } from "./Order.mapper";

export class JsonRequestFactory {
  public static create (type: ItemCategory): IMapper<any, any> {
    switch (type) {
      case ItemCategory.CAKE:
        return new JsonRequestOrderMapper(new JsonCakeRequestMapper());
      default:
        throw new Error("Unsupported type");
    }
  }
}