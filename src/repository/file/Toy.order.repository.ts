import { XMLOrderMapper } from "../../mappers/Order.mapper";
import { OrderRepository } from "./Order.repository";
import { XMLToyMapper } from "../../mappers/Toy.mapper";
import { IOrder } from "../../model/IOrder";
import { readXMLFile, writeXMLFile } from "../../util/xmlParser";
import { DbException } from "../../util/exceptions/repositoryExceptions";

export class ToyOrderRepository extends OrderRepository {
  private mapper = new XMLOrderMapper(new XMLToyMapper());

  constructor(private readonly filePath: string) {
    super();
  }

  protected async load(): Promise<IOrder[]> {
    try {
      const xmlData = await readXMLFile(this.filePath);
      return xmlData.map(this.mapper.map.bind(this.mapper));

    } catch (error) {
      throw new DbException("Failed to load toy orders", error as Error)

    }
  }

  protected async save(orders: IOrder[]): Promise<void> {
    try {
      const raw = orders.map(this.mapper.reverseMap.bind(this.mapper))
      await writeXMLFile(this.filePath, raw);
    } catch (error) {
      throw new DbException("Failed to save toy orders", error as Error)
    }
  }
} 