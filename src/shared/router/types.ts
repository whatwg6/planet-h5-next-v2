import type { ComponentType } from "react";

export type RouteModeState<Mode extends string = string> = {
  routeMode: Mode;
};

export type RouteViewLoader = () => Promise<ComponentType>;

export interface ModeRouteOptions<Mode extends string> {
  path: string;
  defaultView: RouteViewLoader;
  modes?: Partial<Record<Mode, RouteViewLoader>>;
}
