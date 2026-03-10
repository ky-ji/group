import { promises as fs } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function getArg(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) {
    return fallback;
  }

  return args[index + 1] ?? fallback;
}

const outDir = path.resolve(getArg("--out", "out"));
const assetDir = getArg("--asset-dir", "next-assets");
const oldAssetDir = path.join(outDir, "_next");
const newAssetDir = path.join(outDir, assetDir);
const textExtensions = new Set([
  ".css",
  ".html",
  ".ico",
  ".js",
  ".json",
  ".map",
  ".svg",
  ".txt",
  ".webmanifest",
  ".xml",
]);

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const content = await fs.readFile(fullPath, "utf8");
    const rewritten = content.replaceAll("/_next/", `/${assetDir}/`);
    if (rewritten !== content) {
      await fs.writeFile(fullPath, rewritten, "utf8");
    }
  }
}

if (!(await pathExists(oldAssetDir))) {
  throw new Error(`Missing Next.js asset directory: ${oldAssetDir}`);
}

if (await pathExists(newAssetDir)) {
  throw new Error(`Target asset directory already exists: ${newAssetDir}`);
}

await fs.rename(oldAssetDir, newAssetDir);
await walk(outDir);

console.log(`Rewrote Next.js assets to /${assetDir}/ in ${outDir}`);
