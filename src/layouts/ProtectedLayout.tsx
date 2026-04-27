import React from 'react';
// import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';
// import { X } from 'lucide-react';
// import { useAppSelector, useAppDispatch } from '@/store/hooks';
// import { setSidebarOpen } from '@/store/slices/uiSlice';
import { Sidebar } from '@/components/sidebar';
import { AppBar } from './AppBar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  // const dispatch = useAppDispatch();
  // const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="flex h-full overflow-hidden bg-neutral-50">
      {/* Main area */}
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
