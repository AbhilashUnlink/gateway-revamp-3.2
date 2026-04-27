import React from 'react';
import { Navigate } from 'react-router-dom';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';

interface ProtectedRouteProps {
  component: React.LazyExoticComponent<React.ComponentType>;
  allowedGroups?: string[];
  userGroups: string[];
  isAuthenticated: boolean;
}

export function ProtectedRoute({
  component: Component,
  allowedGroups,
  userGroups,
  isAuthenticated,
}: ProtectedRouteProps) {
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isAllowed = !allowedGroups || allowedGroups.some((g) => userGroups.includes(g));
  if (!isAllowed) return <NotFoundPage />;

  return (
    <ProtectedLayout>
      <Component />
    </ProtectedLayout>
  );
}
