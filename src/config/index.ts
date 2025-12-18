import dotenv from "dotenv";
import path from "path";
import { DBMode } from "./types";
import { StringValue } from "ms";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export default {
  logDir: process.env.LOG_DIR || "./logs",
  isDev: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  storagePath: {
    csv: {
      cake: "src/data/cake orders.csv"
    },

    sqlite:"src/data/orders.db",

    json: {
      book: "src/data/book orders.json"
    },

    xml: {
      toy: "src/data/ toy orders.xml"
    }
  },

  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  host: process.env.HOST || "localhost",
  dbMode: DBMode.SQLITE,
  auth: {
    secretKey: process.env.JWT_SECRET_KEY || "secret_1234567890",
    tokenExpiration: (process.env.TOKEN_EXPIRATION || "15m") as StringValue,
    refreshTokenExpiration: (process.env.REFRESH_TOKEN_EXPIRATION || "7d") as StringValue
  }
};
