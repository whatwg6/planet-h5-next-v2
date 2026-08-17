import { createRouteModeState } from "./createRouteModeState";

describe("createRouteModeState", () => {
  it("creates lightweight typed history state", () => {
    expect(createRouteModeState("edit")).toEqual({ routeMode: "edit" });
  });
});
