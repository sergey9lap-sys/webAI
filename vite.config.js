import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        thanks: resolve(__dirname, "thanks/index.html"),
        spasibo: resolve(__dirname, "spasibo/index.html"),
      },
    },
  },
});
