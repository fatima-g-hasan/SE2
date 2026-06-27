import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import { PGConnectionManager } from "../../src/repository/postgreSQL/PGConnectionManager";

describe("Neon test connection", () => {
  it("should connect to the test database", async () => {
    const client = PGConnectionManager.getClient();

    const result = await client.query("SELECT 1 AS value");

    let rows: { value: number }[];

    if (Array.isArray(result)) {
      rows = result as { value: number }[];
    } else {
      rows = result.rows as { value: number }[];
    }

    expect(rows[0].value).toBe(1);
  }, 10000);
});