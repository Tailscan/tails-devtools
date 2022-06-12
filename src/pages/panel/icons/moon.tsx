import * as React from "react";

export const MoonIcon = React.forwardRef<
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
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
});
