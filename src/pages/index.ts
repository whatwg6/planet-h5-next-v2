import type { RouteObject } from "react-router-dom";
import { customerListRoute } from "./customers";
import { settingsRoute } from "./settings";
import { notFoundRoute, offlineRoute } from "./system";

export const routes: RouteObject[] = [
  customerListRoute,
  settingsRoute,
  offlineRoute,
  notFoundRoute,
];
