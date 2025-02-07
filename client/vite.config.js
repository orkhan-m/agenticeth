import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// dotenv
import dotenv from "dotenv";

dotenv.config(); // load env vars from .env

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  define: {
    __VALUE__: `"${process.env.VITE_OPENAI_API_KEY}"`, // eslint-disable-line no-undef
  },
});
