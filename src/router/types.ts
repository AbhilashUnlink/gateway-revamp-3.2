export interface PublicRoute {
  path: string;
  component: string;
  showAll?: boolean;
}

export interface ProtectedRouteConfig {
  path: string;
  component: string;
  allowedGroups: string[];
}

export interface RoutingSetup {
  publicRoutes: PublicRoute[];
  protectedRoutes: ProtectedRouteConfig[];
}

export interface RoutingConfig {
  routingSetup: RoutingSetup;
}
