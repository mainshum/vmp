import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";

type Config = Parameters<
  Exclude<StorybookConfig["webpackFinal"], undefined>
>[0];

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    ({
          name: "@storybook/addon-styling",
          options: {}
        })
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config: Config) => {
    if (config.resolve?.alias) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, '..', "./src"),
      };
    }

    return config;
  },
};
export default config;
