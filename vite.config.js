import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/threejs-space-ship/",
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 3000,
    },
    assetsInclude: ["**/*.glb", "**/*.ttf"],
});
