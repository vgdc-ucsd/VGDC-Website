import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// The database URLs come from the `datasource` block in schema.prisma, whose `env()` is only
// resolved by commands that connect to the database. Declaring them here instead (which
// `engine: "classic"` requires) makes every command, including `prisma generate` in the
// postinstall hook, fail on machines/builds without database credentials.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});
