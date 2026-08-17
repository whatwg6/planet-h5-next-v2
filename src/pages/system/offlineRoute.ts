import { createModeRoute } from "@/shared/router";

export const offlineRoute = createModeRoute({
  path: "/offline",
  defaultView: async () => {
    const { OfflineView } = await import("@/features/system/views/OfflineView");
    return OfflineView;
  },
});
