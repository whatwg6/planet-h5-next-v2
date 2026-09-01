import { createModeRoute } from "@/shared/router";

export const customerDetailRoute = createModeRoute({
  path: "/customers/:customerId",
  defaultView: async () => {
    const { CustomerDetailView } = await import("@/features/customers/views/CustomerDetailView");
    return CustomerDetailView;
  },
});
