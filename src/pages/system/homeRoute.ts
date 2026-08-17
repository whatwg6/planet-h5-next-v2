import { createModeRoute } from "@/shared/router";

export const homeRoute = createModeRoute({
  path: "/",
  defaultView: async () => {
    const { HomeView } = await import("@/features/system/views/HomeView");
    return HomeView;
  },
});
