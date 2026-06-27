import logger from "../../util/logger";
import { IdentifiableToy, Toy } from "../Toy.model";


type ToyBuilderState = {
  type: string;
  ageGroup: string;
  brand: string;
  material: string;
  batteryRequired: boolean;
  educational: boolean;
};

export class ToyBuilder implements ToyBuilderState {
  type!: string;
  ageGroup!: string;
  brand!: string;
  material!: string;
  batteryRequired!: boolean;
  educational!: boolean;

  public static newBuilder(): ToyBuilder {
    return new ToyBuilder();
  }

  static fromExisting(toy: IdentifiableToy): ToyBuilder {
    return ToyBuilder.newBuilder()
      .setType(toy.getType())
      .setAgeGroup(toy.getAgeGroup())
      .setBrand(toy.getBrand())
      .setMaterial(toy.getMaterial())
      .setBatteryRequired(toy.getBatteryRequired())
      .setEducational(toy.getEducational());
  }

  setType(type: string): ToyBuilder {
    this.type = type;
    return this;
  }

  setAgeGroup(ageGroup: string): ToyBuilder {
    this.ageGroup = ageGroup;
    return this;
  }

  setBrand(brand: string): ToyBuilder {
    this.brand = brand;
    return this;
  }

  setMaterial(material: string): ToyBuilder {
    this.material = material;
    return this;
  }

  setBatteryRequired(batteryRequired: boolean): ToyBuilder {
    this.batteryRequired = batteryRequired;
    return this;
  }

  setEducational(educational: boolean): ToyBuilder {
    this.educational = educational;
    return this;
  }

  build(): Toy {
    const requiredProperties: Record<
      keyof ToyBuilderState,
      "string" | "boolean"
    > = {
      type: "string",
      ageGroup: "string",
      brand: "string",
      material: "string",
      batteryRequired: "boolean",
      educational: "boolean",
    };

    for (const prop in requiredProperties) {
      const key = prop as keyof ToyBuilderState;
      const expectedType = requiredProperties[key];
      const value = this[key];

      if (value === undefined || value === null) {
        throw new Error(`${key} is missing`);
      }

      if (typeof value !== expectedType) {
        throw new Error(`${key} must be a ${expectedType}`);
      }
    }

    return new Toy(
      this.type,
      this.ageGroup,
      this.brand,
      this.material,
      this.batteryRequired,
      this.educational
    );
  }
}

export class IdentifiableToyBuilder {
  private id!: string;
  private toy!: Toy;

  static newBuilder(): IdentifiableToyBuilder {
    return new IdentifiableToyBuilder();
  }

  setId(id: string): IdentifiableToyBuilder {
    this.id = id;
    return this;
  }

  setToy(toy: Toy): IdentifiableToyBuilder {
    this.toy = toy;
    return this;
  }

  build(): IdentifiableToy {
    if (!this.id || !this.toy) {
      logger.error(
        "Missing required properties, could not build an identifiable toy"
      );
      throw new Error("Missing required properties");
    }

    return new IdentifiableToy(
      this.id,
      this.toy.getType(),
      this.toy.getAgeGroup(),
      this.toy.getBrand(),
      this.toy.getMaterial(),
      this.toy.getBatteryRequired(),
      this.toy.getEducational()
    );
  }
}