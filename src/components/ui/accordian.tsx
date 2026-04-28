import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface DasAccordionProps {
  title: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  noBorder?: boolean;
  className?: string;
}

export function DasAccordion({
  title,
  children,
  defaultOpen = false,
  noBorder = false,
  className,
}: DasAccordionProps) {
  return (
    <Disclosure
      as="div"
      defaultOpen={defaultOpen}
      className={cn(
        'group flex flex-col gap-3 pb-6',
        !noBorder && 'border-b border-[#e5e5e5]',
        className
      )}
    >
      <DisclosureButton className="flex w-full items-center justify-between">
        <span className="text-base font-semibold text-[#1a1a1a]">{title}</span>
        <ChevronDown
          size={18}
          className="text-[#1a1a1a] transition-transform duration-200 group-data-[open]:rotate-180"
        />
      </DisclosureButton>
      <DisclosurePanel>{children}</DisclosurePanel>
    </Disclosure>
  );
}
