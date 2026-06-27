import logger from "../../util/logger";
import { Cake, IdentifiableCake } from "../Cake.model";


type CakeBuilderState = {
  type: string;
  flavor: string;
  filling: string;
  size: number;
  layers: number;
  frostingType: string;
  frostingFlavor: string;
  decorationType: string;
  decorationColor: string;
  customMessage: string;
  shape: string;
  allergies: string;
  specialIngredients: string;
  packagingType: string;
};

export class CakeBuilder implements CakeBuilderState {
  type!: string;
  flavor!: string;
  filling!: string;
  size!: number;
  layers!: number;
  frostingType!: string;
  frostingFlavor!: string;
  decorationType!: string;
  decorationColor!: string;
  customMessage!: string;
  shape!: string;
  allergies!: string;
  specialIngredients!: string;
  packagingType!: string;

  public static newBuilder(): CakeBuilder {
    return new CakeBuilder();
  }

  static fromExisting(cake: IdentifiableCake): CakeBuilder {
    return CakeBuilder.newBuilder()
      .setType(cake.getType())
      .setFlavor(cake.getFlavor())
      .setFilling(cake.getFilling())
      .setSize(cake.getSize())
      .setLayers(cake.getLayers())
      .setFrostingType(cake.getFrostingType())
      .setFrostingFlavor(cake.getFrostingFlavor())
      .setDecorationType(cake.getDecorationType())
      .setDecorationColor(cake.getDecorationColor())
      .setCustomMessage(cake.getCustomMessage())
      .setShape(cake.getShape())
      .setAllergies(cake.getAllergies())
      .setSpecialIngredients(cake.getSpecialIngredients())
      .setPackagingType(cake.getPackagingType());
  }

  setType(type: string): CakeBuilder {
    this.type = type;
    return this;
  }

  setFlavor(flavor: string): CakeBuilder {
    this.flavor = flavor;
    return this;
  }

  setFilling(filling: string): CakeBuilder {
    this.filling = filling;
    return this;
  }

  setSize(size: number): CakeBuilder {
    this.size = size;
    return this;
  }

  setLayers(layers: number): CakeBuilder {
    this.layers = layers;
    return this;
  }

  setFrostingType(frostingType: string): CakeBuilder {
    this.frostingType = frostingType;
    return this;
  }

  setFrostingFlavor(frostingFlavor: string): CakeBuilder {
    this.frostingFlavor = frostingFlavor;
    return this;
  }

  setDecorationType(decorationType: string): CakeBuilder {
    this.decorationType = decorationType;
    return this;
  }

  setDecorationColor(decorationColor: string): CakeBuilder {
    this.decorationColor = decorationColor;
    return this;
  }

  setCustomMessage(customMessage: string): CakeBuilder {
    this.customMessage = customMessage;
    return this;
  }

  setShape(shape: string): CakeBuilder {
    this.shape = shape;
    return this;
  }

  setAllergies(allergies: string): CakeBuilder {
    this.allergies = allergies;
    return this;
  }

  setSpecialIngredients(specialIngredients: string): CakeBuilder {
    this.specialIngredients = specialIngredients;
    return this;
  }

  setPackagingType(packagingType: string): CakeBuilder {
    this.packagingType = packagingType;
    return this;
  }

  build(): Cake {
    const requiredProperties: Record<keyof CakeBuilderState, "string" | "number"> = {
      type: "string",
      flavor: "string",
      filling: "string",
      size: "number",
      layers: "number",
      frostingType: "string",
      frostingFlavor: "string",
      decorationType: "string",
      decorationColor: "string",
      customMessage: "string",
      shape: "string",
      allergies: "string",
      specialIngredients: "string",
      packagingType: "string",
    };

    for (const prop in requiredProperties) {
      const key = prop as keyof CakeBuilderState;
      const expectedType = requiredProperties[key];
      const value = this[key];

      if (value === undefined || value === null) {
        throw new Error(`${key} is missing`);
      }

      if (typeof value !== expectedType) {
        throw new Error(`${key} must be a ${expectedType}`);
      }

      if (expectedType === "number" && isNaN(value as number)) {
        throw new Error(`${key} must be a valid number`);
      }
    }

    return new Cake(
      this.type,
      this.flavor,
      this.filling,
      this.size,
      this.layers,
      this.frostingType,
      this.frostingFlavor,
      this.decorationType,
      this.decorationColor,
      this.customMessage,
      this.shape,
      this.allergies,
      this.specialIngredients,
      this.packagingType
    );
  }
}

export class IdentifiableCakeBuilder {
  private id!: string;
  private cake!: Cake;

  static newBuilder(): IdentifiableCakeBuilder {
    return new IdentifiableCakeBuilder();
  }

  setId(id: string): IdentifiableCakeBuilder {
    this.id = id;
    return this;
  }

  setCake(cake: Cake): IdentifiableCakeBuilder {
    this.cake = cake;
    return this;
  }

  build(): IdentifiableCake {
    if (!this.id || !this.cake) {
      logger.error("Missing required properties, could not build an identifiable cake");
      throw new Error("Missing required properties");
    }

    return new IdentifiableCake(
      this.id,
      this.cake.getType(),
      this.cake.getFlavor(),
      this.cake.getFilling(),
      this.cake.getSize(),
      this.cake.getLayers(),
      this.cake.getFrostingType(),
      this.cake.getFrostingFlavor(),
      this.cake.getDecorationType(),
      this.cake.getDecorationColor(),
      this.cake.getCustomMessage(),
      this.cake.getShape(),
      this.cake.getAllergies(),
      this.cake.getSpecialIngredients(),
      this.cake.getPackagingType()
    );
  }
}