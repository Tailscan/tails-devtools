import clsx from "clsx";
import * as React from "react";

interface ICheckboxProps<T = HTMLInputElement> {
  onChange?: React.ChangeEventHandler<T>;
  checked?: boolean;
  disabled?: boolean;
  color?: "blue" | "teal" | "pink" | "rose" | "purple";
}

export type CheckboxProps = ICheckboxProps &
  React.HTMLAttributes<HTMLInputElement>;

const colors = {
  rose: {
    checkbox: "text-blue-500 dark:text-yellow-500",
    span: "text-rose-500 dark:text-rose-300",
  },
  purple: {
    checkbox: "text-blue-500 dark:text-yellow-500",
    span: "text-purple-500 dark:text-purple-300",
  },
  blue: {
    checkbox: "text-blue-500 dark:text-yellow-500",
    span: "text-blue-500 dark:text-blue-300",
  },
  teal: {
    checkbox: "text-blue-500 dark:text-yellow-500",
    span: "text-teal-500 dark:text-teal-300",
  },
  pink: {
    checkbox: "text-blue-500 dark:text-yellow-500",
    span: "text-pink-500 dark:text-pink-300",
  },
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, color = "blue", ...props }) => {
    const currColor = (colors as any)[color];
    return (
      <label
        className={clsx(
          "cursor-base inline-flex items-center align-top",
          props.disabled && "cursor-not-allowed"
        )}
      >
        <input
          type="checkbox"
          {...props}
          className={clsx(
            "form-checkbox h-3.5 w-3.5 rounded-sm focus:outline-none focus:ring-0 focus:ring-offset-0 dark:bg-neutral-900 dark:checked:bg-current",
            currColor.checkbox
          )}
        />
        {children && (
          <span
            className={clsx(
              "ml-2 cursor-default p-0 text-xs font-medium",
              currColor.span,
              props.disabled ? "opacity-40" : "opacity-100"
            )}
          >
            {children}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
