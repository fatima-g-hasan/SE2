import fs from "fs";
import path from "path";
import { readJSONFile, writeJSONFile } from "../src/util/jsonParser";

describe("JSON Parser", () => {
  const jsonPath = path.join(__dirname, "test.json");
  const outPath = path.join(__dirname, "out.json");

  afterEach(() => {
    if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  });

  it("reads a valid JSON file correctly", () => {
    const sampleData = { name: "Alice", age: 25 };
    fs.writeFileSync(jsonPath, JSON.stringify(sampleData, null, 2));

    const data = readJSONFile(jsonPath);
    expect(data).toEqual(sampleData);
  });

  it("throws an error when reading invalid JSON", () => {
    fs.writeFileSync(jsonPath, "{ invalid json }");

    expect(() => readJSONFile(jsonPath)).toThrow("Error reading JSON file");
  });

  it("throws an error when file does not exist", () => {
    expect(() => readJSONFile("nonexistent.json")).toThrow(
      "Error reading JSON file"
    );
  });

  it("writes JSON data correctly to a file", () => {
    const data = { language: "JavaScript", level: "Intermediate" };

    writeJSONFile(outPath, data);
    const content = fs.readFileSync(outPath, "utf-8");
    expect(JSON.parse(content)).toEqual(data);
  });

  it("throws an error when writing invalid data", () => {
    expect(() => writeJSONFile(outPath, undefined)).toThrow(
      "Error writing JSON file"
    );
  });
});
