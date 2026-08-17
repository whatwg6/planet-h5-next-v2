import type { RouteObject } from "react-router-dom";
import { homeRoute, notFoundRoute, offlineRoute } from "./system";

export const routes: RouteObject[] = [homeRoute, offlineRoute, notFoundRoute];
