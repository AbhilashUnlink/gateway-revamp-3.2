import { Menu } from 'lucide-react';
// import { useAppDispatch } from '@/store/hooks';
// import { toggleSidebar } from '@/store/slices/uiSlice';

export function AppBar() {
  // const dispatch = useAppDispatch();

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-neutral-100 bg-white px-4">
      <button
        // onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle sidebar"
        className="flex items-center justify-center rounded-md p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7941d]"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}
