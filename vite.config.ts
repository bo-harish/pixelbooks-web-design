import { defineConfig as defineBaseConfig } from "@lovable.dev/vite-tanstack-config";
import type { ConfigEnv, UserConfig } from "vite";

const baseConfig = defineBaseConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

export default async (env: ConfigEnv): Promise<UserConfig> => {
  const config = await (baseConfig as (env: ConfigEnv) => Promise<UserConfig>)(env);

  // Remove vite-tsconfig-paths plugin and enable native Vite tsconfigPaths resolution
  if (Array.isArray(config.plugins)) {
    config.plugins = config.plugins.flat(Infinity).filter((plugin: any) => {
      const name = plugin && typeof plugin === "object" && "name" in plugin ? plugin.name : "";
      return name !== "vite-tsconfig-paths";
    });
  }

  config.resolve = {
    ...config.resolve,
    tsconfigPaths: true,
  };

  return config;
};
