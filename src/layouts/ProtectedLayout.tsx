import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUserPreferences,
  fetchGatewayConfig,
  markGatewayConfigFetched,
  selectGatewayConfigAlreadyFetched,
} from '@/store/slices/gatewayConfigSlice';
import { Sidebar } from '@/components/sidebar';
import { AppBar } from './AppBar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const alreadyFetched = useAppSelector(selectGatewayConfigAlreadyFetched);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (alreadyFetched) return;
    dispatch(markGatewayConfigFetched());
    void dispatch(fetchUserPreferences());
    void dispatch(fetchGatewayConfig());
  }, [dispatch, isAuthenticated, alreadyFetched]);

  return (
    <div className="flex h-full overflow-hidden bg-neutral-50">
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppBar />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
