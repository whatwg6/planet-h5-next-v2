import { createModeRoute } from "@/shared/router";

export const notFoundRoute = createModeRoute({
  path: "*",
  defaultView: async () => {
    const { NotFoundView } = await import("@/features/system/views/NotFoundView");
    return NotFoundView;
  },
});
