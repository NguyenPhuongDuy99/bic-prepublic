import { forwardRef, SVGAttributes } from "react";

export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: string;
  secondaryColor?: string;
}

const EtherIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ ...props }, forwardedRef) => {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M13.9973 0.700195L13.8188 1.30637V18.8946L13.9973 19.0727L22.1614 14.2468L13.9973 0.700195Z"
          fill="#343434"
        />
        <path
          d="M13.9973 0.700195L5.83301 14.2468L13.9973 19.0727V10.5358V0.700195Z"
          fill="#8C8C8C"
        />
        <path
          d="M13.9976 20.6183L13.897 20.741V27.0062L13.9976 27.2998L22.1667 15.7949L13.9976 20.6183Z"
          fill="#3C3C3B"
        />
        <path
          d="M13.9973 27.2998V20.6183L5.83301 15.7949L13.9973 27.2998Z"
          fill="#8C8C8C"
        />
        <path
          d="M13.9971 19.0727L22.1612 14.2469L13.9971 10.5359V19.0727Z"
          fill="#141414"
        />
        <path
          d="M5.83301 14.2469L13.9973 19.0727V10.5359L5.83301 14.2469Z"
          fill="#393939"
        />
      </svg>
    );
  },
);

EtherIcon.displayName = "EtherIcon";

export default EtherIcon;
