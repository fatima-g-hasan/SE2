import fs from "fs";
import path from "path";
import { readXMLFile, writeXMLFile } from "../src/util/xmlParser";

describe("XML Parser", () => {
  const xmlPath = path.join(__dirname, "toy-orders.xml");
  const outPath = path.join(__dirname, "toy-out.xml");

  afterEach(() => {
    if (fs.existsSync(xmlPath)) fs.unlinkSync(xmlPath);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  });

  it("reads XML file and converts to object", () => {
    const xmlContent = `<?xml version='1.0' encoding='utf-8'?>
    <data>
      <row>
        <OrderID>5001</OrderID>
        <Type>Plush Toy</Type>
        <AgeGroup>13+</AgeGroup>
        <Brand>FunTime</Brand>
        <Material>Fabric</Material>
        <BatteryRequired>Yes</BatteryRequired>
        <Educational>Yes</Educational>
        <Price>247</Price>
        <Quantity>7</Quantity>
      </row>
      <row>
        <OrderID>5002</OrderID>
        <Type>Building Blocks</Type>
        <AgeGroup>8-12</AgeGroup>
        <Brand>BuildSmart</Brand>
        <Material>Plastic</Material>
        <BatteryRequired>Yes</BatteryRequired>
        <Educational>Yes</Educational>
        <Price>67</Price>
        <Quantity>1</Quantity>
      </row>
    </data>`;

    fs.writeFileSync(xmlPath, xmlContent);

    const data = readXMLFile(xmlPath);
    expect(data.data.row.length).toBe(2);
    expect(data.data.row[0].Type).toBe("Plush Toy");
    expect(data.data.row[1].Brand).toBe("BuildSmart");
    expect(Number(data.data.row[1].Price)).toBe(67);
  });

  it("writes object to XML file correctly", () => {
    const data = {
      data: {
        row: [
          {
            OrderID: 5001,
            Type: "Plush Toy",
            Brand: "FunTime",
            Price: 247,
          },
          {
            OrderID: 5002,
            Type: "Building Blocks",
            Brand: "BuildSmart",
            Price: 67,
          },
        ],
      },
    };

    writeXMLFile(outPath, data);
    const content = fs.readFileSync(outPath, "utf-8");
    expect(content).toContain("<Type>Plush Toy</Type>");
    expect(content).toContain("<Brand>BuildSmart</Brand>");
  });

  it("throws an error if reading non-existent file", () => {
    expect(() => readXMLFile("nonexistent.xml")).toThrow(
      "Error reading XML file"
    );
  });

  it("throws error when writing invalid object", () => {
    expect(() => writeXMLFile(outPath, undefined as any)).toThrow(
      "Error writing XML file"
    );
  });
});
