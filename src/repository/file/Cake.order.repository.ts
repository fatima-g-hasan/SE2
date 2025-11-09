import { OrderRepository } from "./Order.repository";
import { readCSVFile, writeCSVFile } from "../../util/csv-parser";
import { CSVOrderMapper } from "../../mappers/Order.mapper";
import { CSVCakeMapper } from "../../mappers/Cake.mapper";
import { IOrder } from "../../model/IOrder";
import { DbException } from "../../util/exceptions/repositoryExceptions";

export class CakeOrderRepository extends OrderRepository {
  private mapper = new CSVOrderMapper(new CSVCakeMapper());
  constructor(private readonly filePath: string) {
    super();
  }
  protected async load(): Promise<IOrder[]> {
    try {
      // read 2d strings from file
      const csv = await readCSVFile(this.filePath);
      // return the list of objects
      return csv.map(this.mapper.map.bind(this.mapper));

    } catch (error: unknown) {
        throw new DbException("Failed to load orders", error as Error);
    }
    
  }

  protected async save(orders:IOrder[]): Promise<void> {
    try {
      // generate the list of headers
      const header = [
        "id", "Type", "Flavor", "Filling", "Size","Layers","Frosting Type",
        "Frosting Flavor","Decoration Type","Decoration Color","Custom Message",
        "Shape","Allergies","Special Ingredients","Packaging Type","Price","Quantity"];

      // convert the orders to 2d strings
      const rawItems = orders.map(this.mapper.reverseMap.bind(this.mapper));

      // parse.write
      await writeCSVFile(this.filePath, [header, ...rawItems]);
    } catch (error: unknown) {
      throw new DbException("Failed to load orders", error as Error);
    }
  }
}

