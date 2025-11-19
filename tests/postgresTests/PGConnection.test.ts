import { PGConnectionManager } from "../../src/repository/postgreSQL/PGConnectionManager";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });


describe("Neon test connection", () => {
  it("should connect to the test database", async () => {
    const client = PGConnectionManager.getClient();
    const result = await client.query("SELECT 1 AS value");

let rows: { value: number }[] = [];

  if ("rows" in result && Array.isArray(result.rows)) {
    rows = result.rows as { value: number }[];
  } else if (Array.isArray(result) && result.length > 0 && !Array.isArray(result[0])) {
    rows = result as { value: number }[];
  } else {
    rows = [];
  }

  if (rows.length > 0) {
    console.log(rows[0].value);
  }
    });
});
