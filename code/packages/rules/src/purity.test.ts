import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sourceDirectory = new URL("./", import.meta.url);
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("pure rules kernel (DEC-007)", () => {
  it("depends only on core and content contracts", () => {
    expect(Object.keys(packageJson.dependencies ?? {}).sort()).toEqual([
      "@dndimension/content",
      "@dndimension/core",
    ]);
  });

  it("imports no UI, persistence, network, clock or randomness in production code", () => {
    const productionFiles = readdirSync(sourceDirectory).filter(
      (file) => file.endsWith(".ts") && !file.endsWith(".test.ts"),
    );
    expect(productionFiles.length).toBeGreaterThan(0);
    for (const file of productionFiles) {
      const source = readFileSync(new URL(file, sourceDirectory), "utf8");
      const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((match) => match[1]);
      for (const specifier of imports)
        expect(specifier, `${file} imports ${specifier}`).toMatch(
          /^(\.\/|@dndimension\/(core|content)$)/,
        );
      expect(source, `${file} must not use ambient side effects`).not.toMatch(
        /\b(fetch|Date\.now|new Date|Math\.random|crypto\.|localStorage|indexedDB)\b/,
      );
    }
  });
});
