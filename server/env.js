import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: "development" }),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  PORT: port({ default: 3000 }),
});
