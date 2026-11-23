import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Six Words, One Story — round 2
// A quiet, concrete image with a sharp second beat: a grandmother's
// recipe card is ordinary and warm; the handwriting stopping is the
// turn that reframes it into a small story about loss.

const STORY = "Grandma's recipe card. Her handwriting stopped.";

function resolveOutDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function charCount(line: string): number {
  return [...line].length;
}

function validateStory(line: string): void {
  const words = line.split(/\s+/).filter((w) => w.length > 0);
  if (words.length !== 6) {
    throw new Error(`expected exactly 6 words, got ${words.length}`);
  }
  const chars = charCount(line);
  if (chars < 1 || chars > 60) {
    throw new Error(`expected 1-60 characters, got ${chars}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    throw new Error("entry is not valid UTF-8 round-trip text");
  }
}

function writeStory(): void {
  const outDir = resolveOutDir();
  mkdirSync(outDir, { recursive: true });
  const tmpPath = join(outDir, ".entry.txt.tmp");
  const finalPath = join(outDir, "entry.txt");
  writeFileSync(tmpPath, STORY, "utf8");
  renameSync(tmpPath, finalPath);
  const back = readFileSync(finalPath, "utf8");
  if (back !== STORY) {
    throw new Error("read-back mismatch");
  }
}

validateStory(STORY);
writeStory();
