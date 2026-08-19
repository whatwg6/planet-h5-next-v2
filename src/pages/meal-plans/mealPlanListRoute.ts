import { createModeRoute } from "@/shared/router";

export const mealPlanListRoute = createModeRoute({
  path: "/meal-plans",
  defaultView: async () => {
    const { MealPlanListView } = await import("@/features/meal-plans/views/MealPlanListView");
    return MealPlanListView;
  },
});
