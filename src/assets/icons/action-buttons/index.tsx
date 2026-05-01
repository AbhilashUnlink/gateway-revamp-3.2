import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: SVGProps<SVGSVGElement> = {
  width: 32,
  height: 20,
  viewBox: '0 0 32 20',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
};

export function DownloadButtonIcon(props: IconProps) {
  return (
    <svg
      {...baseProps}
      {...props}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.8115 14.3521C8.03502 14.5575 8.30043 14.7204 8.59256 14.8316C8.88469 14.9428 9.19781 15 9.51402 15C9.83024 15 10.1434 14.9428 10.4355 14.8316C10.7276 14.7204 10.993 14.5575 11.2165 14.3521L13.7928 11.9863C13.9309 11.846 14.005 11.6623 13.9997 11.4732C13.9944 11.2841 13.9102 11.1042 13.7644 10.9706C13.6186 10.837 13.4225 10.76 13.2166 10.7555C13.0107 10.7511 12.8108 10.8195 12.6583 10.9467L10.3107 13.1032L10.3163 1.73679C10.3163 1.54138 10.2318 1.35398 10.0813 1.2158C9.93088 1.07763 9.72681 1 9.51402 1C9.30123 1 9.09716 1.07763 8.9467 1.2158C8.79623 1.35398 8.7117 1.54138 8.7117 1.73679L8.70448 13.0892L6.36973 10.9467C6.21918 10.8085 6.01503 10.7309 5.8022 10.731C5.58937 10.7311 5.38528 10.8088 5.23484 10.947C5.0844 11.0853 4.99992 11.2727 5 11.4682C5.00008 11.6636 5.08469 11.8511 5.23524 11.9892L7.8115 14.3521Z"
        fill="#1A1A1A"
      />
      <path
        d="M18.25 13C18.0511 13 17.8603 13.079 17.7197 13.2197C17.579 13.3603 17.5 13.5511 17.5 13.75V16.75C17.5 16.9489 17.421 17.1397 17.2803 17.2803C17.1397 17.421 16.9489 17.5 16.75 17.5H3.25C3.05109 17.5 2.86032 17.421 2.71967 17.2803C2.57902 17.1397 2.5 16.9489 2.5 16.75V13.75C2.5 13.5511 2.42098 13.3603 2.28033 13.2197C2.13968 13.079 1.94891 13 1.75 13C1.55109 13 1.36032 13.079 1.21967 13.2197C1.07902 13.3603 1 13.5511 1 13.75L1 16.75C1 17.3467 1.23705 17.919 1.65901 18.341C2.08097 18.7629 2.65326 19 3.25 19H16.75C17.3467 19 17.919 18.7629 18.341 18.341C18.7629 17.919 19 17.3467 19 16.75V13.75C19 13.5511 18.921 13.3603 18.7803 13.2197C18.6397 13.079 18.4489 13 18.25 13Z"
        fill="#1A1A1A"
      />
    </svg>
  );
}

export function RefreshButtonIcon(props: IconProps) {
  return (
    <svg
      {...baseProps}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.5 9C16.5 13.14 13.14 16.5 9 16.5C4.86 16.5 2.3325 12.33 2.3325 12.33M2.3325 12.33H5.7225M2.3325 12.33V16.08M1.5 9C1.5 4.86 4.83 1.5 9 1.5C14.0025 1.5 16.5 5.67 16.5 5.67M16.5 5.67V1.92M16.5 5.67H13.17"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ColumnPreferenceButtonIcon(props: IconProps) {
  return (
    <svg
      {...baseProps}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_3053_30709)">
        <path
          d="M7.19908 19.9992C7.03505 19.9992 6.87574 19.935 6.75749 19.8159C6.60414 19.6626 6.54158 19.4416 6.59086 19.2309L7.49922 15.3767C7.52577 15.2633 7.58329 15.16 7.66584 15.0784L15.6209 7.12337C16.3283 6.41506 17.5642 6.41415 18.2725 7.12337L19.4508 8.30166C19.805 8.65505 20 9.1267 20 9.62673C20 10.1275 19.805 10.5992 19.4508 10.9526L11.4958 18.9067C11.4132 18.9892 11.3099 19.0467 11.1975 19.0733L7.34327 19.9817C7.29505 19.9942 7.24668 19.9992 7.19908 19.9992ZM8.67491 15.8358L8.03907 18.5342L10.7374 17.8984L18.5667 10.0692C18.685 9.95083 18.75 9.79427 18.75 9.62749C18.75 9.46087 18.685 9.3034 18.5667 9.18591L17.3883 8.00747C17.1441 7.76424 16.7483 7.76333 16.5042 8.00747L8.67491 15.8358Z"
          fill="#1A1A1A"
        />
        <path
          d="M16.9467 13.1992C16.7867 13.1992 16.6267 13.1383 16.505 13.0159L13.5583 10.0691C13.3142 9.82498 13.3142 9.42917 13.5583 9.18503C13.8025 8.94089 14.1983 8.94089 14.4424 9.18503L17.3892 12.1317C17.6334 12.3758 17.6334 12.7716 17.3892 13.0159C17.2667 13.1383 17.1066 13.1992 16.9467 13.1992Z"
          fill="#1A1A1A"
        />
        <path
          d="M5.70007 17.5H1.875C0.840759 17.5 0 16.6592 0 15.625V1.875C0 0.840759 0.840759 0 1.875 0H13.9583C14.9925 0 15.8333 0.840759 15.8333 1.875V5.73334C15.8333 6.07834 15.5533 6.35834 15.2083 6.35834C14.8633 6.35834 14.5833 6.07834 14.5833 5.73334V1.875C14.5833 1.53 14.3033 1.25 13.9583 1.25H1.875C1.53 1.25 1.25 1.53 1.25 1.875V15.625C1.25 15.97 1.53 16.25 1.875 16.25H5.70007C6.04507 16.25 6.32507 16.53 6.32507 16.875C6.32507 17.22 6.04507 17.5 5.70007 17.5Z"
          fill="#1A1A1A"
        />
        <path
          d="M15.2083 5.41602H0.625C0.279999 5.41602 0 5.13602 0 4.79102C0 4.44601 0.279999 4.16602 0.625 4.16602H15.2083C15.5533 4.16602 15.8333 4.44601 15.8333 4.79102C15.8333 5.13602 15.5533 5.41602 15.2083 5.41602Z"
          fill="#1A1A1A"
        />
        <path
          d="M12.1417 9.58398H0.625C0.279999 9.58398 0 9.30399 0 8.95898C0 8.61398 0.279999 8.33398 0.625 8.33398H12.1417C12.4867 8.33398 12.7667 8.61398 12.7667 8.95898C12.7667 9.30399 12.4867 9.58398 12.1417 9.58398Z"
          fill="#1A1A1A"
        />
        <path
          d="M7.91672 13.75H0.625C0.279999 13.75 0 13.47 0 13.125C0 12.78 0.279999 12.5 0.625 12.5H7.91672C8.26172 12.5 8.54172 12.78 8.54172 13.125C8.54172 13.47 8.26172 13.75 7.91672 13.75Z"
          fill="#1A1A1A"
        />
        <path
          d="M7.91675 13.7493C7.57175 13.7493 7.29175 13.4693 7.29175 13.1243V4.79102C7.29175 4.44601 7.57175 4.16602 7.91675 4.16602C8.26175 4.16602 8.54175 4.44601 8.54175 4.79102V13.1243C8.54175 13.4693 8.26175 13.7493 7.91675 13.7493Z"
          fill="#1A1A1A"
        />
      </g>
      <defs>
        <clipPath id="clip0_3053_30709">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
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

export function BackButtonIcon(props: IconProps) {
  return (
    <svg
      {...baseProps}
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="#1A1A1A"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.2602 15.5297L9.74023 11.9997L13.2602 8.46973"
        stroke="#1A1A1A"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function EditButtonIcon(props: IconProps) {
  return (
    <svg
      {...baseProps}
      {...props}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.16663 1.66699H7.49996C3.33329 1.66699 1.66663 3.33366 1.66663 7.50033V12.5003C1.66663 16.667 3.33329 18.3337 7.49996 18.3337H12.5C16.6666 18.3337 18.3333 16.667 18.3333 12.5003V10.8337"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3667 2.51639L6.80002 9.08306C6.55002 9.33306 6.30002 9.82472 6.25002 10.1831L5.89169 12.6914C5.75835 13.5997 6.40002 14.2331 7.30835 14.1081L9.81669 13.7497C10.1667 13.6997 10.6584 13.4497 10.9167 13.1997L17.4834 6.63306C18.6167 5.49972 19.15 4.18306 17.4834 2.51639C15.8167 0.849722 14.5 1.38306 13.3667 2.51639Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.425 3.45801C12.9834 5.44967 14.5417 7.00801 16.5417 7.57467"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
