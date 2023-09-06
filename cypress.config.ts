import { defineConfig } from "cypress";

import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

const env = {
  clientSessionToken: process.env.SESSION_JWT_TOKEN_CLIENT!,
  vendorSessionToken: process.env.SESSION_JWT_TOKEN_VENDOR!,
  noroleSessionToken: process.env.SESSION_JWT_TOKEN_NOROLE!,
};

export default defineConfig({
  env: env,
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // const defaults = wp.defaultOptions;

      // const options: Parameters<typeof wp>[0] = {
      //   webpackOptions: {
      //     resolve: {
      //       alias: {
      //         "@": path.resolve(__dirname, "./src"),
      //       },
      //     },
      //   },
      // };
      //on("file:preprocessor", wp({}));

      return config;
    },
  },
});
