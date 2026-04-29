import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routingConfig from '@/config/routingConfig.json';
import { loadComponent } from './resolver';
import { ProtectedRoute } from './ProtectedRoute';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import { useAppSelector } from '@/store/hooks';
const DrawerManager = lazy(() => import('@/components/drawer/DrawerManager'));

const useAuth = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const userGroups = useAppSelector((s) => s.auth?.signInData?.Groups);
  return { isAuthenticated, userGroups };
};

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
      <Suspense fallback={<div>Loading...</div>}>
        <DrawerManager />
      </Suspense>
    </BrowserRouter>
  );
}
