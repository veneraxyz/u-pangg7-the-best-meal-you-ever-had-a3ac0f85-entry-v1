// v1: write one sentence about the best meal ever had to entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SENTENCE =
  "At a warung in Yogyakarta, the rendang's coconut gravy clung to warm rice, cinnamon smoke in the air, and I scraped the plate clean like it owed me money.";

function validate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("sentence must not be whitespace only");
  }
  if (line.length < 1 || line.length > 200) {
    throw new Error(`sentence must be 1-200 chars, got ${line.length}`);
  }
  if (line.split("\n").length !== 1) {
    throw new Error("sentence must be exactly one line");
  }
  if (line.includes("\r")) {
    throw new Error("sentence must not contain CR characters");
  }
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
validate(SENTENCE);
const outPath = join(outputDir, "entry.txt");
writeFileSync(outPath, SENTENCE + "\n", "utf8");

// Read-back guard: the bytes on disk must be exactly the intended line
// plus one trailing newline, with no CR anywhere.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk.includes("\r")) {
  throw new Error("entry.txt must not contain CR characters");
}
if (onDisk !== SENTENCE + "\n") {
  throw new Error("entry.txt on disk does not match the intended sentence");
}
const lines = onDisk.split("\n");
if (lines.length !== 2 || lines[1] !== "") {
  throw new Error("entry.txt must be exactly one line plus a trailing newline");
}
console.log(`wrote entry.txt (${SENTENCE.length} chars) to ${outputDir}`);
