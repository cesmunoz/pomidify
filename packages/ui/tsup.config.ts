import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  treeshake: true,
  entry: ["src/index.tsx"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  splitting: false,
  external: ["react", "react-dom"],
  ...options,
  outExtension() {
    return { js: ".js" };
  },
}));
