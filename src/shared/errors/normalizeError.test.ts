import axios from "axios";
import { normalizeError } from "./normalizeError";

describe("normalizeError", () => {
  it("normalizes network failures", () => {
    const error = new axios.AxiosError("Network Error", "ERR_NETWORK");
    expect(normalizeError(error)).toMatchObject({ kind: "Network" });
  });

  it("preserves an existing AppError", () => {
    const normalized = normalizeError(new Error("boom"));
    expect(normalizeError(normalized)).toBe(normalized);
  });
});
