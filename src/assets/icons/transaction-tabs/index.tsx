import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
};

export function ReceiptIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="M16.6667 5.86699V14.1337C16.6667 15.4003 16.55 16.3003 16.25 16.942C16.25 16.9503 16.2417 16.967 16.2333 16.9753C16.05 17.2087 15.8083 17.3253 15.525 17.3253C15.0833 17.3253 14.55 17.0337 13.975 16.417C13.2917 15.6837 12.2416 15.742 11.6416 16.542L10.8 17.6587C10.4667 18.1087 10.025 18.3337 9.58333 18.3337C9.14167 18.3337 8.69998 18.1087 8.36665 17.6587L7.51668 16.5337C6.92502 15.742 5.88333 15.6837 5.19999 16.4087L5.19165 16.417C4.24998 17.4253 3.41668 17.5753 2.93335 16.9753C2.92502 16.967 2.91667 16.9503 2.91667 16.942C2.61667 16.3003 2.5 15.4003 2.5 14.1337V5.86699C2.5 4.60033 2.61667 3.70032 2.91667 3.05866C2.91667 3.05032 2.91668 3.04199 2.93335 3.03366C3.40835 2.42532 4.24998 2.57532 5.19165 3.58366L5.19999 3.59199C5.88333 4.31699 6.92502 4.25866 7.51668 3.46699L8.36665 2.34199C8.69998 1.89199 9.14167 1.66699 9.58333 1.66699C10.025 1.66699 10.4667 1.89199 10.8 2.34199L11.6416 3.45866C12.2416 4.25866 13.2917 4.31699 13.975 3.58366C14.55 2.96699 15.0833 2.67532 15.525 2.67532C15.8083 2.67532 16.05 2.80032 16.2333 3.03366C16.25 3.04199 16.25 3.05032 16.25 3.05866C16.55 3.70032 16.6667 4.60033 16.6667 5.86699Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66663 8.54199H13.3333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66663 11.458H11.6666"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArchiveIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="M7.49996 18.3337H12.5C16.6666 18.3337 18.3333 16.667 18.3333 12.5003V7.50033C18.3333 3.33366 16.6666 1.66699 12.5 1.66699H7.49996C3.33329 1.66699 1.66663 3.33366 1.66663 7.50033V12.5003C1.66663 16.667 3.33329 18.3337 7.49996 18.3337Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 6.45866V12.0837C15 11.167 14.25 10.417 13.3333 10.417H6.66663C5.74996 10.417 4.99996 11.167 4.99996 12.0837V6.45866C4.99996 5.54199 5.74996 4.79199 6.66663 4.79199H13.3333C14.25 4.79199 15 5.54199 15 6.45866Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8333 13.125H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.99996 13.125H4.16663"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 11.6667V9.16667C15 8.25 14.25 7.5 13.3333 7.5H6.66667C5.75 7.5 5 8.25 5 9.16667V11.6667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12.0837V13.1253H12.0833C12.0833 14.2753 11.15 15.2087 10 15.2087C8.85 15.2087 7.91667 14.2753 7.91667 13.1253H5V12.0837C5 11.167 5.75 10.417 6.66667 10.417H13.3333C14.25 10.417 15 11.167 15 12.0837Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="M6.66663 1.66699V4.16699"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3334 1.66699V4.16699"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.91667 7.575H17.0833"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 7.08366V14.167C17.5 16.667 16.25 18.3337 13.3333 18.3337H6.66667C3.75 18.3337 2.5 16.667 2.5 14.167V7.08366C2.5 4.58366 3.75 2.91699 6.66667 2.91699H13.3333C16.25 2.91699 17.5 4.58366 17.5 7.08366Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0789 11.4167H13.0864"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0789 13.9167H13.0864"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99624 11.4167H10.0037"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99624 13.9167H10.0037"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.91193 11.4167H6.91941"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.91193 13.9167H6.91941"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BuyCryptoIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="M18.3333 7.08366C18.3333 10.0753 15.9083 12.5003 12.9167 12.5003C12.775 12.5003 12.625 12.492 12.4833 12.4837C12.275 9.842 10.1583 7.72532 7.51666 7.51698C7.50832 7.37532 7.5 7.22533 7.5 7.08366C7.5 4.09199 9.925 1.66699 12.9167 1.66699C15.9083 1.66699 18.3333 4.09199 18.3333 7.08366Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 12.9167C12.5 15.9083 10.075 18.3333 7.08333 18.3333C4.09167 18.3333 1.66667 15.9083 1.66667 12.9167C1.66667 9.925 4.09167 7.5 7.08333 7.5C7.225 7.5 7.37499 7.50832 7.51666 7.51666C10.1583 7.72499 12.275 9.84168 12.4833 12.4833C12.4917 12.625 12.5 12.775 12.5 12.9167Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.35 12.183L7.08333 10.833L7.81667 12.183L9.16667 12.9163L7.81667 13.6497L7.08333 14.9997L6.35 13.6497L5 12.9163L6.35 12.183Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReceiptEditIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="M17.0834 9.41698V5.867C17.0834 2.50867 16.3 1.66699 13.15 1.66699H6.85002C3.70002 1.66699 2.91669 2.50867 2.91669 5.867V15.2503C2.91669 17.467 4.13336 17.992 5.60836 16.4087L5.61668 16.4003C6.30001 15.6753 7.34168 15.7336 7.93334 16.5253L8.77502 17.6503"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66669 5.83301H13.3334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9.16699H12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.1758 12.3086L12.2259 15.2586C12.1092 15.3752 12.0008 15.5919 11.9758 15.7502L11.8175 16.8752C11.7592 17.2836 12.0425 17.5669 12.4508 17.5086L13.5759 17.3502C13.7342 17.3252 13.9592 17.2169 14.0675 17.1002L17.0175 14.1502C17.5259 13.6419 17.7675 13.0502 17.0175 12.3002C16.2759 11.5586 15.6842 11.8002 15.1758 12.3086Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.7493 12.7336C14.9993 13.6336 15.6993 14.3336 16.5993 14.5836"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
