#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import console from "node:console";
import { existsSync, linkSync, mkdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const MAX_IMAGE_EDGE = 8_192;
const MAX_PIXEL_COUNT = 8_000_000;
const COMMAND_CHECK_TIMEOUT_MS = 5_000;
const PROBE_TIMEOUT_MS = 10_000;
const DIFF_TIMEOUT_MS = 60_000;
const SUPPORTED_PIXEL_FORMATS = new Set([
  "abgr",
  "argb",
  "bgra",
  "gray",
  "pal8",
  "rgb24",
  "rgba",
  "ya8",
]);

function fail(message) {
  console.error(`pixel-diff: ${message}`);
  process.exit(1);
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function requireCommand(command) {
  const result = spawnSync(command, ["-version"], {
    encoding: "utf8",
    timeout: COMMAND_CHECK_TIMEOUT_MS,
  });
  if (result.error?.code === "ENOENT") {
    fail(`${command} is required but was not found on PATH`);
  }
  if (result.error?.code === "ETIMEDOUT") {
    fail(`${command} did not respond within ${COMMAND_CHECK_TIMEOUT_MS}ms`);
  }
  if (result.error) {
    fail(`${command} is unavailable: ${errorMessage(result.error)}`);
  }
  if (result.status !== 0) {
    fail(`${command} is unavailable`);
  }
}

function imageInfo(filePath) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=codec_name,pix_fmt,width,height",
      "-of",
      "json",
      filePath,
    ],
    { encoding: "utf8", timeout: PROBE_TIMEOUT_MS },
  );

  if (result.error?.code === "ETIMEDOUT") {
    fail(`ffprobe timed out while inspecting ${filePath}`);
  }
  if (result.error) {
    fail(`could not run ffprobe for ${filePath}: ${errorMessage(result.error)}`);
  }
  if (result.status !== 0) {
    fail(`could not inspect ${filePath}: ${result.stderr.trim() || "unknown ffprobe error"}`);
  }

  let stream;
  try {
    stream = JSON.parse(result.stdout).streams?.[0];
  } catch {
    fail(`ffprobe returned invalid metadata for ${filePath}`);
  }
  if (!stream?.width || !stream?.height) {
    fail(`could not determine image dimensions for ${filePath}`);
  }
  if (stream.codec_name !== "png") {
    fail(`input image must be a PNG: ${filePath}`);
  }
  if (!SUPPORTED_PIXEL_FORMATS.has(stream.pix_fmt)) {
    fail(
      `input PNG must decode to a supported 8-bit format (${[...SUPPORTED_PIXEL_FORMATS].join(", ")}): ` +
        `${filePath} uses ${stream.pix_fmt || "an unknown pixel format"}`,
    );
  }

  const pixelCount = stream.width * stream.height;
  if (
    stream.width > MAX_IMAGE_EDGE ||
    stream.height > MAX_IMAGE_EDGE ||
    pixelCount > MAX_PIXEL_COUNT
  ) {
    fail(
      `input image exceeds the safety limit: ${filePath} is ${stream.width}x${stream.height}; ` +
        `maximum edge is ${MAX_IMAGE_EDGE}px and maximum area is ${MAX_PIXEL_COUNT} pixels`,
    );
  }

  return { height: stream.height, pixelFormat: stream.pix_fmt, width: stream.width };
}

const [referenceArg, actualArg, outputArg, backgroundArg, ...extraArgs] = process.argv.slice(2);

if (!referenceArg || !actualArg || !outputArg || !backgroundArg || extraArgs.length > 0) {
  fail("usage: node pixel-diff.mjs <figma.png> <browser.png> <diff.png> <background-rrggbb>");
}

const backgroundHex = backgroundArg.replace(/^#/, "");
if (!/^[0-9a-fA-F]{6}$/.test(backgroundHex)) {
  fail("background must be a six-digit sRGB hex color such as ffffff");
}

requireCommand("ffmpeg");
requireCommand("ffprobe");

const referencePath = path.resolve(referenceArg);
const actualPath = path.resolve(actualArg);
const outputPath = path.resolve(outputArg);

if (path.extname(outputPath).toLowerCase() !== ".png") {
  fail("output path must use the .png extension");
}

for (const filePath of [referencePath, actualPath]) {
  if (!existsSync(filePath)) fail(`input file does not exist: ${filePath}`);
}

if (outputPath === referencePath || outputPath === actualPath) {
  fail("output path must not overwrite an input image");
}
if (existsSync(outputPath)) {
  fail(`output path already exists; choose a unique diff path: ${outputPath}`);
}

const referenceInfo = imageInfo(referencePath);
const actualInfo = imageInfo(actualPath);

if (referenceInfo.width !== actualInfo.width || referenceInfo.height !== actualInfo.height) {
  fail(
    `image dimensions differ: Figma is ${referenceInfo.width}x${referenceInfo.height}, ` +
      `browser is ${actualInfo.width}x${actualInfo.height}; recapture at matching dimensions instead of resizing`,
  );
}

try {
  mkdirSync(path.dirname(outputPath), { recursive: true });
} catch (error) {
  fail(`could not create the diff output directory: ${errorMessage(error)}`);
}

const channelDifference = "max(max(r(X,Y),g(X,Y)),b(X,Y))";
const highlightedDifference = `if(eq(${channelDifference},0),0,min(255,48+4*${channelDifference}))`;
const background =
  `color=c=0x${backgroundHex}:s=${referenceInfo.width}x${referenceInfo.height}:d=1,` +
  "format=rgb24";
const filter =
  `${background}[referenceBackground];` +
  `${background}[actualBackground];` +
  "[referenceBackground][0:v]" +
  "overlay=shortest=1:format=rgb:alpha=straight,format=gbrp[reference];" +
  "[actualBackground][1:v]" +
  "overlay=shortest=1:format=rgb:alpha=straight,format=gbrp[actual];" +
  "[reference][actual]blend=all_mode=difference:shortest=1[raw];" +
  `[raw]geq=r='255':g='255-${highlightedDifference}':` +
  `b='255-${highlightedDifference}',format=rgb24[diff]`;

const temporaryOutputPath = path.join(
  path.dirname(outputPath),
  `.${path.basename(outputPath)}.${process.pid}-${Date.now()}.tmp.png`,
);

function failAfterCleanup(message) {
  try {
    rmSync(temporaryOutputPath, { force: true });
  } catch (error) {
    fail(`${message}; could not remove the temporary PNG: ${errorMessage(error)}`);
  }
  fail(message);
}

const result = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-nostdin",
    "-xerror",
    "-y",
    "-i",
    referencePath,
    "-i",
    actualPath,
    "-filter_complex",
    filter,
    "-map",
    "[diff]",
    "-frames:v",
    "1",
    "-an",
    "-sn",
    "-dn",
    "-c:v",
    "png",
    "-pix_fmt",
    "rgb24",
    "-update",
    "1",
    temporaryOutputPath,
  ],
  { encoding: "utf8", timeout: DIFF_TIMEOUT_MS },
);

if (result.error?.code === "ETIMEDOUT") {
  failAfterCleanup(`ffmpeg timed out after ${DIFF_TIMEOUT_MS}ms`);
}
if (result.error) {
  failAfterCleanup(`could not run ffmpeg: ${errorMessage(result.error)}`);
}
if (result.status !== 0) {
  failAfterCleanup(`ffmpeg failed: ${result.stderr.trim() || "unknown ffmpeg error"}`);
}

let temporaryOutputStat;
try {
  temporaryOutputStat = statSync(temporaryOutputPath);
} catch (error) {
  failAfterCleanup(`could not inspect the generated diff PNG: ${errorMessage(error)}`);
}
if (!temporaryOutputStat.isFile() || temporaryOutputStat.size === 0) {
  failAfterCleanup("ffmpeg completed without producing a non-empty diff PNG");
}
try {
  linkSync(temporaryOutputPath, outputPath);
} catch (error) {
  if (error?.code === "EEXIST") {
    failAfterCleanup(`output path already exists; choose a unique diff path: ${outputPath}`);
  }
  failAfterCleanup(`could not publish diff PNG: ${errorMessage(error)}`);
}

try {
  rmSync(temporaryOutputPath);
} catch (error) {
  fail(
    `diff PNG was published at ${outputPath}, but its temporary hard link could not be removed: ` +
      errorMessage(error),
  );
}

console.log(
  JSON.stringify({
    reference: referencePath,
    actual: actualPath,
    diff: outputPath,
    background: `#${backgroundHex.toLowerCase()}`,
    width: referenceInfo.width,
    height: referenceInfo.height,
  }),
);
