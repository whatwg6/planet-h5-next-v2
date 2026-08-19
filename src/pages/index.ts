import type { RouteObject } from "react-router-dom";
import { customerListRoute } from "./customers";
import { mealPlanListRoute } from "./meal-plans";
import { settingsRoute } from "./settings";
import { notFoundRoute, offlineRoute } from "./system";

export const routes: RouteObject[] = [
  customerListRoute,
  mealPlanListRoute,
  settingsRoute,
  offlineRoute,
  notFoundRoute,
];
