import http from "node:http";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { context } from "esbuild";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, "..");
const publicDir = path.join(frontendDir, "public");
const srcDir = path.join(frontendDir, "src");

dotenv.config({ path: path.join(frontendDir, ".env") });

const PORT = Number(process.env.PORT) || 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".map": "application/json"
};

async function startDevServer() {
  console.log("[Dev] Preparing development build...");

  const devBuildDir = path.join(frontendDir, ".dev-build");
  await fs.rm(devBuildDir, { recursive: true, force: true });
  await fs.mkdir(path.join(devBuildDir, "static", "js"), { recursive: true });
  await fs.mkdir(path.join(devBuildDir, "static", "css"), { recursive: true });

  const defineEnv = {
    "process.env.NODE_ENV": JSON.stringify("development")
  };
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("REACT_APP_")) {
      defineEnv[`process.env.${key}`] = JSON.stringify(value);
    }
  }

  // 1. Setup esbuild in watch mode
  const ctx = await context({
    entryPoints: [path.join(srcDir, "index.js")],
    bundle: true,
    format: "iife",
    outfile: path.join(devBuildDir, "static", "js", "bundle.js"),
    sourcemap: true,
    jsx: "automatic",
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".css": "empty"
    },
    define: defineEnv
  });

  await ctx.watch();
  console.log("[Dev] esbuild is watching for JavaScript changes.");

  // 2. Setup Tailwind compiler in watch mode
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const tailwindProcess = spawn(
    npxCmd,
    [
      "@tailwindcss/cli",
      "-i",
      path.join(srcDir, "index.css"),
      "-o",
      path.join(devBuildDir, "static", "css", "main.css"),
      "--watch"
    ],
    {
      cwd: frontendDir,
      stdio: "inherit",
      shell: process.platform === "win32"
    }
  );

  tailwindProcess.on("error", (err) => {
    console.error("[Dev] Tailwind watcher error:", err.message);
  });

  // 3. Create HTTP Dev Server with SPA routing fallback
  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Try dev-build directory first (compiled static/js and static/css)
    let filePath = path.join(devBuildDir, pathname);
    let stat = null;
    try {
      stat = await fs.stat(filePath);
      if (stat.isDirectory()) stat = null;
    } catch {
      stat = null;
    }

    // Try public directory
    if (!stat) {
      filePath = path.join(publicDir, pathname);
      try {
        stat = await fs.stat(filePath);
        if (stat.isDirectory()) stat = null;
      } catch {
        stat = null;
      }
    }

    // If file found and not a directory, serve it
    if (stat) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      fsSync.createReadStream(filePath).pipe(res);
      return;
    }

    // Fallback: serve index.html for React Router SPA
    const indexHtmlPath = path.join(publicDir, "index.html");
    try {
      let html = await fs.readFile(indexHtmlPath, "utf8");
      html = html.replace(/%PUBLIC_URL%/g, "");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error: index.html not found");
    }
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Preply React Frontend running at:`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Network: http://0.0.0.0:${PORT}`);
    console.log(`   Target Backend: ${process.env.REACT_APP_API_URL || "http://localhost:5000"}`);
    console.log(`==================================================\n`);
  });

  process.on("SIGINT", async () => {
    console.log("\n[Dev] Stopping frontend dev server...");
    tailwindProcess.kill();
    await ctx.dispose();
    server.close();
    process.exit(0);
  });
}

startDevServer().catch((err) => {
  console.error("[Dev] Failed to start:", err);
  process.exit(1);
});
