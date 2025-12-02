import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        dualWave1: resolve(__dirname, "dual-wave-1.html"),
        dualWave2: resolve(__dirname, "dual-wave-2.html"),
        dualWave3: resolve(__dirname, "dual-wave-3.html"),
        dualWave4: resolve(__dirname, "dual-wave-4.html"),
        dualWave5: resolve(__dirname, "dual-wave-5.html"),
      },
    },
  },
});
