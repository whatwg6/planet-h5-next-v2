import type { RouteModeState } from "./types";

export function createRouteModeState<const Mode extends string>(
  routeMode: Mode,
): RouteModeState<Mode> {
  return { routeMode };
}
