import logger from "../../util/logger";
import { Cake, IdentifiableCake } from "../Cake.model";


export class CakeBuilder {
  private type!: string;
  private flavor!: string;
  private filling!: string;
  private size!: number;
  private layers!: number;
  private frostingType!: string;
  private frostingFlavor!: string;
  private decorationType!: string;
  private decorationColor!: string;
  private customMessage!: string;
  private shape!: string;
  private allergies!: string;
  private specialIngredients!: string;
  private packagingType!: string;

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
    const requiredProperties = {
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
    for (const [prop, type] of Object.entries(requiredProperties)) {
      const value = (this as any)[prop];
      if (value === undefined || value === null) {
        throw new Error(`${prop} is missing`);
      }
      if (typeof value !== type) {
        throw new Error(`${prop} must be a ${type}`);
      }

      if (type === "number" && isNaN(value)) {
        throw new Error(`${prop} must be a valid number`);
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
    )
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
      logger.error("Missing required properties, could not build an identiable cake");
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
      this.cake.getPackagingType(),
    );
  }
}