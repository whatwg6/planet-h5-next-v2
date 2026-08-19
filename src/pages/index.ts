import type { RouteObject } from "react-router-dom";
import { customerListRoute } from "./customers";
import { notFoundRoute, offlineRoute } from "./system";

export const routes: RouteObject[] = [customerListRoute, offlineRoute, notFoundRoute];
