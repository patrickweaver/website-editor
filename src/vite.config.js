import { viteSingleFile } from "vite-plugin-singlefile";

export default {
  root: "src",
  build: {
    outDir: `../dist`,
    minify: false,
    emptyOutDir: true,
  },
  plugins: [viteSingleFile({ removeViteModuleLoader: true })],
};
