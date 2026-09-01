import type { RouteObject } from "react-router-dom";
import { customerDetailRoute, customerListRoute } from "./customers";
import { mealPlanListRoute } from "./meal-plans";
import { settingsRoute } from "./settings";
import { notFoundRoute, offlineRoute } from "./system";

export const routes: RouteObject[] = [
  customerListRoute,
  customerDetailRoute,
  mealPlanListRoute,
  settingsRoute,
  offlineRoute,
  notFoundRoute,
];
