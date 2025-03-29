import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  root: "src",
  build: {
    outDir: `../dist`,
    minify: false,
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
  plugins: [viteSingleFile({ removeViteModuleLoader: true })],
});
