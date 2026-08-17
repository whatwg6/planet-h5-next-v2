import { Suspense, createElement, lazy, useMemo } from "react";
import { useLocation, type RouteObject } from "react-router-dom";
import type { ModeRouteOptions, RouteModeState, RouteViewLoader } from "./types";

function lazyView(loader: RouteViewLoader) {
  return lazy(async () => ({ default: await loader() }));
}

export function createModeRoute<Mode extends string>({
  path,
  defaultView,
  modes = {},
}: ModeRouteOptions<Mode>): RouteObject {
  const DefaultView = lazyView(defaultView);
  const modeViews = Object.fromEntries(
    Object.entries(modes).map(([mode, loader]) => [mode, lazyView(loader as RouteViewLoader)]),
  );

  function ModeRoute() {
    const location = useLocation();
    const mode = (location.state as Partial<RouteModeState> | null)?.routeMode;
    const View = useMemo(() => {
      if (!mode) return DefaultView;
      const matched = modeViews[mode];
      if (!matched && import.meta.env.DEV) {
        console.warn(`[router] 未知 routeMode "${mode}"，已回退到默认视图。`);
      }
      return matched ?? DefaultView;
    }, [mode]);

    return createElement(
      Suspense,
      { fallback: createElement("div", { role: "status" }, "加载中…") },
      createElement(View),
    );
  }

  return { path, Component: ModeRoute };
}
