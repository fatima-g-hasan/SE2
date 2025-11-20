import { OrderRepository } from "./Order.repository";
import { readJSONFile, writeJSONFile } from "../../util/jsonParser";
import { JSONOrderMapper } from "../../mappers/Order.mapper";
import { JSONBookMapper } from "../../mappers/Book.mapper";
import { IOrder } from "../../model/IOrder";
import { DbException } from "../../util/exceptions/repositoryExceptions";

export class BookOrderRepository extends OrderRepository {
  private mapper = new JSONOrderMapper(new JSONBookMapper());

  constructor(private readonly filePath: string) {
    super();
  }

  protected async load(): Promise<IOrder[]> {
    try {
      const jsonData = await readJSONFile(this.filePath);
      return jsonData.map(this.mapper.map.bind(this.mapper));
    } catch (error) {
      throw new DbException("Failed to load book orders", error as Error);
    }
  }

  protected async save(orders: IOrder[]): Promise<void> {
    try {
      const raw = orders.map(this.mapper.reverseMap.bind(this.mapper));
      await writeJSONFile(this.filePath, raw);
    } catch (error) {
      throw new DbException("Failed to save book orders", error as Error);
    }
  }
}
