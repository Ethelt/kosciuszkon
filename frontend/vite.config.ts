import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

const selfDestroying = process.env.SW_DESTROY === "true";

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  const isDevelopment = process.env.SW_DEV === "true";
  const keyPath = path.resolve(__dirname, "src/certs/localhost-key.pem");
  const certPath = path.resolve(__dirname, "src/certs/localhost.pem");
  const certificatesExist = fs.existsSync(keyPath) && fs.existsSync(certPath);

  return defineConfig({
    build: {
      sourcemap: process.env.SOURCE_MAP === "true",
    },
    plugins: [
      react({
        babel: {
          plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
        },
      }),
      svgr(),
      VitePWA({
        mode: "development",
        base: "/",
        srcDir: "src",
        filename: "sw.ts",
        strategies: "injectManifest",
        injectManifest: {
          minify: false,
          enableWorkboxModulesLogs: true,
        },
        registerType: "autoUpdate",
        selfDestroying: selfDestroying,
        manifest: {
          name: "GreenJob",
          short_name: "GreenJob",
          description:
            "App for managing your tasks for you in a sustainable way",
          theme_color: "#328E6E",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/favicon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*"],
          clientsClaim: true,
          skipWaiting: true,
          cleanupOutdatedCaches: true,
        },
        includeAssets: ["**/*"],
        devOptions: {
          enabled: process.env.SW_DEV === "true",
          type: "module",
          navigateFallback: "index.html",
        },
      }),
    ],
    server:
      isDevelopment && certificatesExist
        ? {
          https: {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
          },
          host: "0.0.0.0",
        }
        : {
          host: "0.0.0.0",
        },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@styles": path.resolve(__dirname, "src/styles"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@store": path.resolve(__dirname, "src/store"),
        "@types": path.resolve(__dirname, "src/types"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@api": path.resolve(__dirname, "src/api"),
        "@constants": path.resolve(__dirname, "src/constants"),
        "@layouts": path.resolve(__dirname, "src/layouts"),
      },
    },
  });
};
