import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "src", "assets", "scenes");

// Source files and their output names
const FILES = [
  { src: "coding.svg", out: "coding.svg" },
  { src: "Gaming-bro.svg", out: "gaming.svg" },
  { src: "reading.svg", out: "reading.svg" },
];

// Group IDs to strip entirely (matched as substring of the id attribute)
const GROUPS_TO_STRIP = ["background-simple", "background-complete", "Shadow"];

// Color remappings — minimal: only remap accent colors.
// Skin tones, whites, grays, and strokes stay as-is.
// Dark mode handled via CSS filter on the component wrapper.
const COLOR_MAP = [
  { from: "#92E3A9", to: "var(--accent)" },
  { from: "#407BFF", to: "var(--accent)" },
];

/**
 * Strip a <g> group by id substring, handling nested <g> tags correctly.
 * Works on single-line SVG content.
 */
function stripGroup(content, idSubstring) {
  // Find all opening <g> tags whose id contains the substring
  const openPattern = new RegExp(
    `<g\\s+id="[^"]*${escapeRegex(idSubstring)}[^"]*"`,
    "gi"
  );

  let match;
  while ((match = openPattern.exec(content)) !== null) {
    const startIndex = match.index;

    // Now walk forward from the match, counting <g> open/close tags
    let depth = 0;
    let i = startIndex;
    let endIndex = -1;

    while (i < content.length) {
      // Check for opening <g> tag (but not self-closing <g .../>)
      if (content[i] === "<" && content[i + 1] === "g" && /[\s>]/.test(content[i + 2] || "")) {
        // Check if it's self-closing
        const closeAngle = content.indexOf(">", i);
        if (closeAngle !== -1 && content[closeAngle - 1] === "/") {
          // Self-closing, skip
          i = closeAngle + 1;
          continue;
        }
        depth++;
        i = closeAngle + 1;
        continue;
      }

      // Check for closing </g> tag
      if (
        content[i] === "<" &&
        content[i + 1] === "/" &&
        content[i + 2] === "g" &&
        content[i + 3] === ">"
      ) {
        depth--;
        if (depth === 0) {
          endIndex = i + 4; // past </g>
          break;
        }
        i += 4;
        continue;
      }

      i++;
    }

    if (endIndex !== -1) {
      content = content.slice(0, startIndex) + content.slice(endIndex);
      // Reset the regex since we modified the string
      openPattern.lastIndex = startIndex;
    }
  }

  return content;
}

/**
 * Remap colors in style attributes (fill, stroke).
 */
function remapColors(content) {
  for (const mapping of COLOR_MAP) {
    if (mapping.exact) {
      // For #fff, match only when followed by a non-hex character
      // This prevents matching #ffffff or #fff000 etc.
      const hex = escapeRegex(mapping.from);
      const pattern = new RegExp(hex + "(?![0-9a-fA-F])", "gi");
      content = content.replace(pattern, mapping.to);
    } else {
      const pattern = new RegExp(escapeRegex(mapping.from), "gi");
      content = content.replace(pattern, mapping.to);
    }
  }
  return content;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Main
function main() {
  // Create output directory
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const file of FILES) {
    const srcPath = path.join(ROOT, file.src);
    console.log(`Processing ${file.src}...`);

    let content = fs.readFileSync(srcPath, "utf8");

    // Strip groups
    for (const groupId of GROUPS_TO_STRIP) {
      content = stripGroup(content, groupId);
    }

    // Remap colors
    content = remapColors(content);

    const outPath = path.join(OUT_DIR, file.out);
    fs.writeFileSync(outPath, content, "utf8");
    console.log(`  -> ${path.relative(ROOT, outPath)}`);
  }

  console.log("\nDone! Processed SVGs written to src/assets/scenes/");
}

main();
