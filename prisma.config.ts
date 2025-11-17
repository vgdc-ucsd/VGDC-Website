import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("POSTGRES_PRISMA_URL"),
    directUrl: env("POSTGRES_URL_NON_POOLING"),
  },
});
