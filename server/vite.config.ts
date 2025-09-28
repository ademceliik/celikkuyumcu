import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "index.ts",
      output: {
        format: "es",
        entryFileNames: "index.js",
      },
    },
    target: "node18",
    minify: false,
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@shared": path.resolve(import.meta.dirname, "../shared"),
    },
  },
});
