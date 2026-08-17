function positiveNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`环境变量必须是正数，实际值：${value}`);
  }
  return parsed;
}

export const env = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
  apiTimeoutMs: positiveNumber(import.meta.env.VITE_API_TIMEOUT_MS, 10_000),
});
