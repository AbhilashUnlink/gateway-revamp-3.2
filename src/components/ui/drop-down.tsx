import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { DasIcon } from './das-icon';

export default function DropDown() {
  return (
    <div className="fixed top-24 w-52 text-right">
      <Menu>
        <MenuButton className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
          Options
          <DasIcon name="chevron-down" className="size-4 text-gray-500" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 mt-2 origin-top-right rounded-xl border border-gray-200 bg-white p-1 text-sm text-gray-700 shadow-lg transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100">
              <DasIcon name="pencil" className="size-4 text-gray-500" />
              Edit
              <kbd className="ml-auto hidden text-xs text-gray-400 group-hover:inline">⌘E</kbd>
            </button>
          </MenuItem>

          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100">
              <DasIcon name="copy" className="size-4 text-gray-500" />
              Duplicate
              <kbd className="ml-auto hidden text-xs text-gray-400 group-hover:inline">⌘D</kbd>
            </button>
          </MenuItem>

          <div className="my-1 h-px bg-gray-200" />

          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100">
              <DasIcon name="archive" className="size-4 text-gray-500" />
              Archive
              <kbd className="ml-auto hidden text-xs text-gray-400 group-hover:inline">⌘A</kbd>
            </button>
          </MenuItem>

          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-red-50 text-red-600">
              <DasIcon name="trash" className="size-4 text-red-500" />
              Delete
              <kbd className="ml-auto hidden text-xs text-red-400 group-hover:inline">⌘D</kbd>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
