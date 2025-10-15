import fs from "fs";
import path from "path";
import { readCSVFile, writeCSVFile } from "../src/util/parser";

describe("CSV Parser", () => {
  const csvPath = path.join(__dirname, "test.csv");
  const outPath = path.join(__dirname, "out.csv");

  afterEach(() => {
    if (fs.existsSync(csvPath)) fs.unlinkSync(csvPath);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  });

  it("reads CSV without header", async () => {
    fs.writeFileSync(csvPath, "apple,red\nbanana,yellow");
    const data = await readCSVFile(csvPath);
    expect(data).toEqual([["banana", "yellow"]]);
  });

  it("reads CSV with header (still returns arrays)", async () => {
    fs.writeFileSync(csvPath, "name,color\napple,red\nbanana,yellow");
    const data = await readCSVFile(csvPath, true);
    expect(data).toEqual([
      ["name", "color"],
      ["apple", "red"],
      ["banana", "yellow"],
    ]);
  });

  it("writes CSV correctly", async () => {
    const rows = [
      ["name", "color"],
      ["apple", "red"],
      ["banana", "yellow"],
    ];
    await writeCSVFile(outPath, rows);
    const content = fs.readFileSync(outPath, "utf-8").trim();
    expect(content).toContain("apple,red");
  });

  it("handles empty CSV file", async () => {
    fs.writeFileSync(csvPath, "");
    const data = await readCSVFile(csvPath);
    expect(data).toEqual([]);
  });

  it("throws an error if file does not exist", async () => {
    await expect(readCSVFile("nonexistent.csv")).rejects.toThrow(
      /Error reading CSV file/
    );
  });

  it("throws error when writing invalid CSV data", async () => {
    await expect(writeCSVFile(outPath, null as any)).rejects.toThrow(
      /Error writing CSV file/
    );
  });
});
