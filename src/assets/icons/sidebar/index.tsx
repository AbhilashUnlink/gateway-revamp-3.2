import type { SVGProps } from 'react';

export type SidebarIconProps = Omit<SVGProps<SVGSVGElement>, 'size'> & {
  size?: number;
};

function svgProps({ size = 18, ...rest }: SidebarIconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 18 18',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...rest,
  };
}

export function DashboardIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M2 2H8V10H2V2Z" fill="currentColor" />
      <path d="M10 2H16V6H10V2Z" fill="currentColor" />
      <path d="M10 8H16V16H10V8Z" fill="currentColor" />
      <path d="M2 12H8V16H2V12Z" fill="currentColor" />
    </svg>
  );
}

export function TransactionsIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="9" cy="9" r="8" fill="currentColor" />
      <path
        d="M5 7H11L9.5 5.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M13 11H7L8.5 12.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function MerchantsIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="6.5" cy="5" r="2.5" fill="currentColor" />
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <path d="M2 14C2 11.5 4 9.5 6.5 9.5C9 9.5 11 11.5 11 14V15H2V14Z" fill="currentColor" />
      <path
        d="M11 11C11.5 10.5 12 10.5 12.5 10.5C14.5 10.5 16 12 16 14V15H12V14C12 12.5 11.6 11.5 11 11Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ProductsIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M9 1L16 4.5V13.5L9 17L2 13.5V4.5L9 1Z" fill="currentColor" />
      <path
        d="M2 4.5L9 8L16 4.5"
        stroke="white"
        strokeWidth="1"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M9 8V17" stroke="white" strokeWidth="1" fill="none" />
      <path d="M5.5 2.75L12.5 6.25" stroke="white" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function RiskManagementIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M3 1.5H10L14 5.5V16.5H3V1.5Z" fill="currentColor" />
      <path
        d="M10 1.5V5.5H14"
        stroke="white"
        strokeWidth="0.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11 16.5L14.5 10.5L18 16.5H11Z"
        fill="currentColor"
        stroke="white"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M14.5 12.5V14" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="14.5" cy="15.25" r="0.4" fill="white" />
    </svg>
  );
}

export function AcquirersIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M9 1L1 5H17L9 1Z" fill="currentColor" />
      <path d="M2.5 6V13H4V6H2.5Z" fill="currentColor" />
      <path d="M6 6V13H7.5V6H6Z" fill="currentColor" />
      <path d="M10.5 6V13H12V6H10.5Z" fill="currentColor" />
      <path d="M14 6V13H15.5V6H14Z" fill="currentColor" />
      <path d="M1 14H17V16.5H1V14Z" fill="currentColor" />
    </svg>
  );
}

export function StatementsIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M3 1.5H11L15 5.5V16.5H3V1.5Z" fill="currentColor" />
      <path
        d="M11 1.5V5.5H15"
        stroke="white"
        strokeWidth="0.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M5.5 8H12.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M5.5 10.5H12.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M5.5 13H10" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

export function DisputeManagementIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M3 1.5H10L14 5.5V16.5H3V1.5Z" fill="currentColor" />
      <path
        d="M10 1.5V5.5H14"
        stroke="white"
        strokeWidth="0.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M5.5 9.5L7.5 11.5L11.5 7.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function HashCardIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect x="1" y="3.5" width="16" height="11" rx="2" fill="currentColor" />
      <rect x="1" y="6" width="16" height="2" fill="white" />
      <rect x="3" y="10.5" width="3" height="2" rx="0.4" fill="white" />
      <rect x="7" y="10.5" width="3" height="2" rx="0.4" fill="white" />
    </svg>
  );
}

export function SalesLeadIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps({ ...props, viewBox: '0 0 20 20' })}>
      <path d="M3.5 2H11.5L15.5 6V18H3.5V2Z" fill="currentColor" />
      <path
        d="M11.5 2V6H15.5"
        stroke="white"
        strokeWidth="0.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9.5 8L10.4 10L12.5 10.2L11 11.6L11.4 13.7L9.5 12.7L7.6 13.7L8 11.6L6.5 10.2L8.6 10L9.5 8Z"
        fill="white"
      />
    </svg>
  );
}

export function HelpSupportIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M1 4.5C1 3.4 1.9 2.5 3 2.5H10C11.1 2.5 12 3.4 12 4.5V8.5C12 9.6 11.1 10.5 10 10.5H6.5L4 13V10.5H3C1.9 10.5 1 9.6 1 8.5V4.5Z"
        fill="currentColor"
      />
      <path
        d="M14 7C15.65 7 17 8.35 17 10V13C17 14.1 16.1 15 15 15H14L11.5 17.5V15H10C9.4 15 8.85 14.7 8.5 14.3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
      />
    </svg>
  );
}

export function PrivacyPolicyIcon(props: SidebarIconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="9" cy="9" r="8" fill="currentColor" />
      <circle cx="9" cy="5" r="0.9" fill="white" />
      <rect x="8.25" y="7" width="1.5" height="6" rx="0.6" fill="white" />
    </svg>
  );
}
