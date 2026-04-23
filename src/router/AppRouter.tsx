import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routingConfig from '@/config/routingConfig.json';
import { loadComponent } from './resolver';
import { ProtectedRoute } from './ProtectedRoute';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
// import type { RoutingConfig } from './types';

// Replace with real auth store integration (Redux, context, etc.)
const useAuth = () => ({
  isAuthenticated: true,
  userGroups: [
    'SALES',
    'SALESOPS',
    'FRAUD',
    'RISK',
    'COMPLIANCE',
    'SUPPORT',
    'SETTLEMENT',
    'FINANCE',
    'CUSTOMER',
    'GUEST',
    'GUESTSCHEDULER',
  ] as string[],
});

function Router() {
  const { isAuthenticated, userGroups } = useAuth();
  const { publicRoutes, protectedRoutes } = routingConfig;

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-sm text-neutral-500">
          Loading…
        </div>
      }
    >
      <Routes>
        {publicRoutes.map((route) => {
          const Component = loadComponent(route.component);
          return <Route key={route.path} path={route.path} element={<Component />} />;
        })}
        {protectedRoutes.map((route) => {
          const Component = loadComponent(route.component);
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute
                  component={Component}
                  allowedGroups={route.allowedGroups}
                  userGroups={userGroups}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
          );
        })}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
