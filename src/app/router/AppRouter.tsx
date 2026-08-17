import { useEffect } from "react";
import { createHashRouter, RouterProvider, useRouteError } from "react-router-dom";
import { routes } from "@/pages";
import { noopMonitoring } from "@/shared/monitoring";
import { ErrorState, Page } from "@/shared/ui";

function RouteErrorView() {
  const error = useRouteError();

  useEffect(() => {
    noopMonitoring.captureError(error, { boundary: "router" });
  }, [error]);

  return (
    <Page>
      <ErrorState onRetry={() => window.location.reload()} />
    </Page>
  );
}

const router = createHashRouter(
  routes.map((route) => ({ ...route, errorElement: <RouteErrorView /> })),
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
