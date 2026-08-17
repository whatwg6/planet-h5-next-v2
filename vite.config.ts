import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const isStorybook = process.env.STORYBOOK === "true";

export default defineConfig({
  plugins: [
    react(),
    ...(!isStorybook
      ? [
          VitePWA({
            registerType: "prompt",
            injectRegister: false,
            manifest: {
              name: "Planet H5",
              short_name: "Planet",
              description: "Planet 移动端管理系统",
              display: "standalone",
              start_url: "./#/",
              scope: "./",
              theme_color: "#ffffff",
              background_color: "#f5f7fb",
              icons: [
                { src: "icons/icon.svg", sizes: "any", type: "image/svg+xml" },
                {
                  src: "icons/icon-maskable.svg",
                  sizes: "any",
                  type: "image/svg+xml",
                  purpose: "maskable",
                },
              ],
            },
            workbox: {
              navigateFallback: "index.html",
              runtimeCaching: [
                {
                  urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
                  handler: "NetworkOnly",
                  method: "GET",
                },
              ],
            },
            devOptions: { enabled: false },
          }),
        ]
      : []),
  ],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
});
