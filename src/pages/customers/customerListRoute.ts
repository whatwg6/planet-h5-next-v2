import { createModeRoute } from "@/shared/router";

export const customerListRoute = createModeRoute({
  path: "/",
  defaultView: async () => {
    const { CustomerListView } = await import("@/features/customers/views/CustomerListView");
    return CustomerListView;
  },
});
