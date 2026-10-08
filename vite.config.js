import { defineConfig } from "vite";

// The preview tool assigns a port through PORT; fall back to 5173 for `npm run dev`.
const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  server: { port, strictPort: Boolean(process.env.PORT) },
});
