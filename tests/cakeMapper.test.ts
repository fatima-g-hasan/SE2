import {CSVCakeMapper} from "../src/mappers/Cake.mapper";
import { Cake } from "../src/model/Cake.model";

describe("CSVCakeMapper", () => {

  let mapper: CSVCakeMapper;

  beforeEach(() => {
    mapper = new CSVCakeMapper();
  })
  it("should correctly map valid CSV data to a Cake object", () => {
    const data = [
      "1",                 
      "Chocolate",        
      "Vanilla",           
      "Cream",            
      "10",               
      "2",               
      "Buttercream",      
      "Chocolate",        
      "Flowers",           
      "Pink",              
      "Happy Birthday!",  
      "Round",             
      "Nuts",              
      "Berries",        
      "Box" 
    ];

    const cake = mapper.map(data);

    expect(cake).toBeInstanceOf(Cake);
    expect(cake.getType()).toBe("Chocolate");
    expect(cake.getSize()).toBe(10);
    expect(cake.getLayers()).toBe(2);
    expect(cake.getPackagingType()).toBe("Box");
  });

  it("should throw an error when a required field is missing", () => {
    const dataMissing = [
      "1", "Chocolate", "Vanilla", "Cream", "10", "2", "Buttercream",
      "Chocolate", "Flowers", "Pink", "Happy Birthday!", "Round", "Nuts"
    ];

    expect(() => mapper.map(dataMissing)).toThrow();
  }); 

  test("should throw an error when a numeric field has invalid type", () => {
    const dataInvalidType = [
      "1", "Chocolate", "Vanilla", "Cream", "ten", "two", "Buttercream",
      "Chocolate", "Flowers", "Pink", "Happy Birthday!", "Round",
      "Nuts", "Berries", "Box"
    ];

    expect(() => mapper.map(dataInvalidType)).toThrow();
  });
});
