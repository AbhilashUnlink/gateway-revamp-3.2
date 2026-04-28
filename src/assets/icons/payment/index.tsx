import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: SVGProps<SVGSVGElement> = {
  width: 32,
  height: 20,
  viewBox: '0 0 32 20',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
};

export function VisaIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect width="32" height="20" rx="3" fill="white" stroke="#E5E5E5" />
      <path d="M13.7 13.5L15.1 6.5H17.2L15.8 13.5H13.7Z" fill="#1A1F71" />
      <path
        d="M22.3 6.65C21.9 6.5 21.3 6.4 20.5 6.4C18.6 6.4 17.3 7.4 17.3 8.85C17.3 9.95 18.3 10.55 19.05 10.9C19.85 11.3 20.1 11.55 20.1 11.9C20.1 12.4 19.4 12.65 18.8 12.65C17.95 12.65 17.5 12.5 16.8 12.2L16.55 12.05L16.3 13.7C16.85 13.9 17.85 14.05 18.9 14.1C20.95 14.1 22.2 13.1 22.2 11.6C22.2 10.7 21.65 10.05 20.5 9.5C19.8 9.15 19.4 8.95 19.4 8.6C19.4 8.3 19.8 8.05 20.5 8.05C21.1 8.05 21.55 8.15 21.95 8.3L22.1 8.4L22.3 6.65Z"
        fill="#1A1F71"
      />
      <path
        d="M25.6 6.5H24C23.5 6.5 23.1 6.65 22.9 7.15L20 13.5H22.05L22.5 12.4H25L25.25 13.5H27.05L25.6 6.5ZM23.1 10.95C23.25 10.55 23.95 8.85 23.95 8.85C23.95 8.85 24.1 8.4 24.2 8.15L24.35 8.8C24.35 8.8 24.75 10.6 24.85 10.95H23.1Z"
        fill="#1A1F71"
      />
      <path
        d="M11.9 6.5L9.95 11.3L9.7 10.1C9.3 8.65 8.1 7.1 6.75 6.4L8.55 13.5H10.6L13.95 6.5H11.9Z"
        fill="#1A1F71"
      />
      <path
        d="M7.85 6.5H4.7L4.65 6.65C7.1 7.3 8.7 8.85 9.4 10.7L8.7 7.15C8.6 6.7 8.25 6.55 7.85 6.5Z"
        fill="#FAA61A"
      />
    </svg>
  );
}

export function MastercardIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect width="32" height="20" rx="3" fill="white" stroke="#E5E5E5" />
      <circle cx="13" cy="10" r="5.5" fill="#EB001B" />
      <circle cx="19" cy="10" r="5.5" fill="#F79E1B" />
      <path
        d="M16 5.8C17.4 6.85 18.3 8.32 18.3 10C18.3 11.68 17.4 13.15 16 14.2C14.6 13.15 13.7 11.68 13.7 10C13.7 8.32 14.6 6.85 16 5.8Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function JcbIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect width="32" height="20" rx="3" fill="white" stroke="#E5E5E5" />
      <rect x="6" y="5" width="6" height="10" rx="1" fill="#0E4C96" />
      <rect x="13" y="5" width="6" height="10" rx="1" fill="#D0162B" />
      <rect x="20" y="5" width="6" height="10" rx="1" fill="#3CB462" />
      <text
        x="16"
        y="13"
        fontFamily="Arial, sans-serif"
        fontSize="6"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        JCB
      </text>
    </svg>
  );
}

export function AmexIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect width="32" height="20" rx="3" fill="#2E77BC" />
      <text
        x="16"
        y="13"
        fontFamily="Arial, sans-serif"
        fontSize="6"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        AMEX
      </text>
    </svg>
  );
}

export function UnionPayIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect width="32" height="20" rx="3" fill="white" stroke="#E5E5E5" />
      <rect x="5" y="4" width="7" height="12" rx="1" fill="#D10429" />
      <rect x="12.5" y="4" width="7" height="12" rx="1" fill="#003E7E" />
      <rect x="20" y="4" width="7" height="12" rx="1" fill="#0095A8" />
      <text
        x="16"
        y="13"
        fontFamily="Arial, sans-serif"
        fontSize="4.5"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        UnionPay
      </text>
    </svg>
  );
}

export function ApplePayIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect width="32" height="20" rx="3" fill="white" stroke="#E5E5E5" />
      <path
        d="M11 8.4C11.3 8.05 11.5 7.55 11.45 7.05C11 7.07 10.45 7.35 10.15 7.75C9.9 8.05 9.65 8.6 9.7 9.1C10.2 9.13 10.7 8.85 11 8.4Z"
        fill="#000"
      />
      <path
        d="M11.45 9.2C10.8 9.2 10.25 9.6 9.9 9.6C9.55 9.6 9.05 9.2 8.5 9.2C7.8 9.2 7.15 9.6 6.8 10.3C6.1 11.6 6.65 13.45 7.35 14.5C7.65 15 8.05 15.55 8.55 15.55C9.05 15.55 9.2 15.25 9.8 15.25C10.4 15.25 10.55 15.55 11.05 15.55C11.6 15.55 11.95 15.05 12.25 14.55C12.6 13.95 12.75 13.4 12.75 13.4C12.75 13.4 11.65 12.95 11.65 11.75C11.65 10.75 12.45 10.3 12.5 10.25C12.05 9.6 11.35 9.5 11.1 9.5L11.45 9.2Z"
        fill="#000"
      />
      <text
        x="22"
        y="13"
        fontFamily="Arial, sans-serif"
        fontSize="6"
        fontWeight="600"
        fill="#000"
        textAnchor="middle"
      >
        Pay
      </text>
    </svg>
  );
}

export function GCashIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect width="32" height="20" rx="3" fill="white" stroke="#E5E5E5" />
      <circle cx="16" cy="10" r="6" fill="#007DFE" />
      <path
        d="M19.5 10C19.5 11.93 17.93 13.5 16 13.5C14.07 13.5 12.5 11.93 12.5 10C12.5 8.07 14.07 6.5 16 6.5C16.96 6.5 17.83 6.89 18.46 7.52L17.4 8.58C17.04 8.22 16.55 8 16 8C14.9 8 14 8.9 14 10C14 11.1 14.9 12 16 12C16.83 12 17.55 11.49 17.86 10.75H16V9.25H19.5V10Z"
        fill="white"
      />
    </svg>
  );
}

export function GenericCardIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="0.5" y="0.5" width="31" height="19" rx="2.5" fill="white" stroke="#E5E5E5" />
      <rect x="3" y="6" width="26" height="3" fill="#1A1A1A" />
      <rect x="3" y="12" width="8" height="2" rx="0.5" fill="#808080" />
    </svg>
  );
}
