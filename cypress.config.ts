import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  env: {
    sessionToken: process.env.SESSION_JWT_TOKEN!,
  },
  e2e: {
    setupNodeEvents(on, config) {},
  },
});
