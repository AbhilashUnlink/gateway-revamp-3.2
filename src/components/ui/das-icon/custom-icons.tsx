import type { SVGProps } from 'react';

/**
 * Standalone button-style SVGs (66x66 with built-in white card + drop shadow).
 * These are NOT lucide icons — they ship as full-button graphics from the
 * Figma design system, so the consumer renders them directly as the button
 * content (no wrapper styling needed).
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function EditButtonIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 66 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_edit_btn)">
        <rect x="9" y="5" width="48" height="48" rx="16" fill="white" />
        <path
          d="M32.168 20.6667H30.5013C26.3346 20.6667 24.668 22.3334 24.668 26.5V31.5C24.668 35.6667 26.3346 37.3334 30.5013 37.3334H35.5013C39.668 37.3334 41.3346 35.6667 41.3346 31.5V29.8334"
          stroke="#1A1A1A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M36.3675 21.5167L29.8009 28.0834C29.5509 28.3334 29.3009 28.825 29.2509 29.1834L28.8925 31.6917C28.7592 32.6 29.4009 33.2334 30.3092 33.1084L32.8175 32.75C33.1675 32.7 33.6592 32.45 33.9175 32.2L40.4842 25.6334C41.6175 24.5 42.1509 23.1834 40.4842 21.5167C38.8175 19.85 37.5009 20.3834 36.3675 21.5167Z"
          stroke="#1A1A1A"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.4258 22.4583C35.9841 24.45 37.5424 26.0083 39.5424 26.575"
          stroke="#1A1A1A"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_edit_btn"
          x="0"
          y="0"
          width="66"
          height="66"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="4.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

export function DeleteButtonIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 66 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_delete_btn)">
        <rect x="9" y="5" width="48" height="48" rx="16" fill="white" />
        <path
          d="M40.5 23.9833C37.725 23.7083 34.9333 23.5667 32.15 23.5667C30.5 23.5667 28.85 23.65 27.2 23.8167L25.5 23.9833"
          stroke="#FF4343"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30.082 23.1417L30.2654 22.05C30.3987 21.2584 30.4987 20.6667 31.907 20.6667H34.0904C35.4987 20.6667 35.607 21.2917 35.732 22.0584L35.9154 23.1417"
          stroke="#FF4343"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M38.7096 26.6166L38.168 35.0083C38.0763 36.3166 38.0013 37.3333 35.6763 37.3333H30.3263C28.0013 37.3333 27.9263 36.3166 27.8346 35.0083L27.293 26.6166"
          stroke="#FF4343"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31.6094 32.75H34.3844"
          stroke="#FF4343"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30.918 29.4167H35.0846"
          stroke="#FF4343"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_delete_btn"
          x="0"
          y="0"
          width="66"
          height="66"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="4.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
