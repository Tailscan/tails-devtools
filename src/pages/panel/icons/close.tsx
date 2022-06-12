import * as React from "react";

export const CloseIcon = React.forwardRef<
  SVGSVGElement,
  React.HtmlHTMLAttributes<SVGSVGElement>
>(({ color = "currentColor", ...rest }, ref) => {
  return (
    <svg
      ref={ref}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      strokeWidth={2}
      {...rest}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
});
