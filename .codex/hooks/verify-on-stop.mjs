import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const result = spawnSync("pnpm", ["verify"], {
  cwd: repositoryRoot,
  stdio: ["ignore", process.stderr, process.stderr],
});

if (result.error) {
  process.stderr.write(`Failed to start pnpm verify: ${result.error.message}\n`);
}

if (result.status === 0) {
  process.stdout.write("{}\n");
} else {
  process.stdout.write(
    `${JSON.stringify({
      decision: "block",
      reason: "pnpm verify failed. Fix the reported failures, then run pnpm verify again before completing.",
    })}\n`,
  );
}
