import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = path.resolve(process.cwd(), "frontend", "..");
const frontendDir = path.join(rootDir, "frontend");
const distDir = path.join(rootDir, "dist");
const assetsDir = path.join(distDir, "assets");

await fs.rm(distDir, { recursive: true, force: true });
await fs.mkdir(assetsDir, { recursive: true });
await fs.copyFile(path.join(frontendDir, "index.html"), path.join(distDir, "index.html"));
await fs.copyFile(
  path.join(rootDir, "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs"),
  path.join(assetsDir, "pdf.worker.mjs")
);

await build({
  entryPoints: [path.join(frontendDir, "src/main.jsx")],
  bundle: true,
  format: "iife",
  outfile: path.join(assetsDir, "app.js"),
  sourcemap: true,
  minify: process.env.NODE_ENV === "production",
  jsx: "automatic",
  loader: {
    ".js": "jsx",
    ".jsx": "jsx"
  }
});

const npmCommand = path.join(
  rootDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tailwindcss.cmd" : "tailwindcss"
);
const tailwind = spawnSync(
  npmCommand,
  ["-i", path.join(frontendDir, "src/index.css"), "-o", path.join(distDir, "assets/index.css"), "--minify"],
  { cwd: rootDir, stdio: "inherit", shell: process.platform === "win32" }
);

if (tailwind.error || tailwind.status !== 0) {
  console.error("[Build] Tailwind failed:", tailwind.error || `exit code ${tailwind.status}`);
  process.exit(tailwind.status || 1);
}

console.log("[Build] React and Tailwind client built without Vite.");
