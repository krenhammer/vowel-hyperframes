/**
 * Regenerates transcript-words.js from turso-rag.json and verifies the top-level
 * `text` field matches joined `words` (the video reads `words` only).
 *
 * Run from this directory: `bun run sync-transcript-from-json.mjs`
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dir, "turso-rag.json");
const outPath = join(__dir, "transcript-words.js");

const j = JSON.parse(readFileSync(jsonPath, "utf8"));
const joined = j.words.map((x) => x.text).join(" ");
const normalized = (j.text || "").replace(/\s+/g, " ").trim();
if (joined !== normalized) {
  console.error(
    "[sync-transcript] turso-rag.json: `text` and joined `words` differ. Fix the `words` array to match `text` (or vice versa), then re-run."
  );
  process.exit(1);
}

writeFileSync(outPath, `window.TURSO_RAG_WORDS=${JSON.stringify(j.words)};\n`, "utf8");
console.log("[sync-transcript] Wrote transcript-words.js (" + j.words.length + " words), text check OK.");
