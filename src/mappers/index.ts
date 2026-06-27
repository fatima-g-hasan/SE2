import { ItemCategory } from "../model/IItem";
import { IdentifiableOrderItem } from "../model/Order.model";
import { JsonCakeRequestMapper } from "./Cake.mapper";
import { IMapper } from "./IMapper";
import { JsonOrderRequest, JsonRequestOrderMapper } from "./Order.mapper";

export class JsonRequestFactory {
  public static create(
    type: ItemCategory
  ): IMapper<JsonOrderRequest, IdentifiableOrderItem> {

    switch (type) {
      case ItemCategory.CAKE:
        return new JsonRequestOrderMapper(
          new JsonCakeRequestMapper()
        );

      default:
        throw new Error("Unsupported type");
    }
  }
}