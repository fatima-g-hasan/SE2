import { neon } from "@neondatabase/serverless";

export class PGConnectionManager {
  private static client: ReturnType<typeof neon> | null = null;

  static getClient() {
    if (!this.client) {
      const url = process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL;

      if (!url) {
        throw new Error("Database URL not set");
      }

      this.client = neon(url);
    }
    return this.client;
  }
}
