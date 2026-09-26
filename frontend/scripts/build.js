import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, "..");
const buildDir = path.join(frontendDir, "build");
const publicDir = path.join(frontendDir, "public");
const srcDir = path.join(frontendDir, "src");

// Load frontend .env if present
dotenv.config({ path: path.join(frontendDir, ".env") });

async function buildFrontend() {
  console.log("[Build] Starting production build for React frontend...");

  // 1. Clean output directory
  await fs.rm(buildDir, { recursive: true, force: true });
  await fs.mkdir(path.join(buildDir, "static", "js"), { recursive: true });
  await fs.mkdir(path.join(buildDir, "static", "css"), { recursive: true });
  await fs.mkdir(path.join(buildDir, "assets"), { recursive: true });

  // 2. Copy public directory to build directory
  try {
    await fs.cp(publicDir, buildDir, { recursive: true });
  } catch (err) {
    console.warn("[Build] Warning: could not copy public dir:", err.message);
  }

  // 3. Collect environment variables prefixed with REACT_APP_
  const defineEnv = {
    "process.env.NODE_ENV": JSON.stringify("production")
  };
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("REACT_APP_")) {
      defineEnv[`process.env.${key}`] = JSON.stringify(value);
    }
  }

  // 4. Bundle JavaScript with esbuild
  console.log("[Build] Bundling JavaScript...");
  await build({
    entryPoints: [path.join(srcDir, "index.js")],
    bundle: true,
    format: "iife",
    outfile: path.join(buildDir, "static", "js", "bundle.js"),
    sourcemap: false,
    minify: true,
    jsx: "automatic",
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".css": "empty"
    },
    define: defineEnv
  });

  // 5. Build CSS with Tailwind CLI
  console.log("[Build] Compiling Tailwind CSS...");
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const tailwind = spawnSync(
    npxCmd,
    [
      "@tailwindcss/cli",
      "-i",
      path.join(srcDir, "index.css"),
      "-o",
      path.join(buildDir, "static", "css", "main.css"),
      "--minify"
    ],
    {
      cwd: frontendDir,
      stdio: "inherit",
      shell: process.platform === "win32"
    }
  );

  if (tailwind.error || tailwind.status !== 0) {
    console.error("[Build] Tailwind compilation failed:", tailwind.error || `Exit code ${tailwind.status}`);
    process.exit(tailwind.status || 1);
  }

  // 6. Ensure index.html references the bundled CSS & JS and replaces %PUBLIC_URL%
  const indexHtmlPath = path.join(buildDir, "index.html");
  try {
    let html = await fs.readFile(indexHtmlPath, "utf8");
    html = html.replace(/%PUBLIC_URL%/g, "");
    if (!html.includes("/static/css/main.css")) {
      html = html.replace("</head>", '  <link rel="stylesheet" href="/static/css/main.css">\n</head>');
    }
    if (!html.includes("/static/js/bundle.js")) {
      html = html.replace("</body>", '  <script defer src="/static/js/bundle.js"></script>\n</body>');
    }
    await fs.writeFile(indexHtmlPath, html, "utf8");
  } catch (err) {
    console.warn("[Build] Warning: could not process index.html:", err.message);
  }

  // 7. Ensure pdf.worker.mjs is available in assets/ and root
  try {
    const workerCandidates = [
      path.join(frontendDir, "public", "assets", "pdf.worker.mjs"),
      path.join(frontendDir, "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs"),
      path.join(frontendDir, "..", "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs")
    ];
    for (const cand of workerCandidates) {
      try {
        await fs.access(cand);
        await fs.copyFile(cand, path.join(buildDir, "assets", "pdf.worker.mjs"));
        await fs.copyFile(cand, path.join(buildDir, "pdf.worker.mjs"));
        break;
      } catch {
        // try next candidate
      }
    }
  } catch {
    // optional
  }

  console.log("[Build] Success! Production frontend build generated in: frontend/build/");
}

buildFrontend().catch((err) => {
  console.error("[Build] Fatal error:", err);
  process.exit(1);
});
