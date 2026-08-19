import { createModeRoute } from "@/shared/router";

export const settingsRoute = createModeRoute({
  path: "/settings",
  defaultView: async () => {
    const { SettingsView } = await import("@/features/settings/views/SettingsView");
    return SettingsView;
  },
});
