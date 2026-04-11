/* ============================================
   Button — single source of truth for every CTA
   --------------------------------------------
   NO `"use client"` directive on this file so `buttonClasses()` can be
   imported from server components (e.g. a static page applying button
   styling to a `<Link>`). The interactive `<Button>` component below
   uses `forwardRef` and native DOM props only — no hooks, no state —
   so it also renders fine in either environment.

   Variants
   - primary    bg-text-primary / text-bg     (auto-inverts per theme)
   - secondary  bg-bg-card / border-border    (the "other" choice)
   - ghost      no bg / no border             (low-emphasis nav)
   - icon       like secondary, square/circle (icon-only)
   Sizes
   - sm   h-9   text-[13px]
   - md   h-11  text-[14px]   (default)
   - lg   h-13  text-[15px]
   - icon-sm / icon-md / icon-lg   square equivalents
   ============================================ */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
export type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon-sm"
  | "icon-md"
  | "icon-lg";

export interface ButtonClassesOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Primary — text-primary token flips per theme:
  // light/sepia → near-black on cream;  dark/night → near-white on black.
  primary:
    "bg-text-primary text-bg border border-transparent hover:opacity-90",
  secondary:
    "bg-bg-card text-text-primary border border-border hover:bg-bg-subtle",
  ghost:
    "bg-transparent text-text-secondary border border-transparent hover:text-text-primary hover:bg-bg-subtle",
  icon:
    "bg-bg-card text-text-secondary border border-border hover:text-text-primary hover:bg-bg-subtle",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-5 text-[14px] gap-2",
  lg: "h-[52px] px-7 text-[15px] gap-2",
  "icon-sm": "h-9 w-9",
  "icon-md": "h-11 w-11",
  "icon-lg": "h-[52px] w-[52px]",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-full font-semibold font-inter " +
  "transition-colors transition-opacity duration-150 " +
  "focus-visible:outline-none " +
  "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

/**
 * Build the className string for a button-styled element. Useful when you
 * need to apply button styling to a non-button element (e.g. a `<Link>` or
 * `<a>`). Prefer `<Button>` when you need a real `<button>`.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: ButtonClassesOptions = {}): string {
  return [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  /** Icon to show before the label. Hidden while `loading`. */
  leadingIcon?: ReactNode;
  /** Icon to show after the label. Hidden while `loading`. */
  trailingIcon?: ReactNode;
  /** HTML button type — defaults to `"button"` to avoid accidental form submits. */
  type?: "button" | "submit" | "reset";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      leadingIcon,
      trailingIcon,
      disabled,
      type = "button",
      className = "",
      children,
      ...rest
    },
    ref
  ) {
    const isIconOnly = size.startsWith("icon-");
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={buttonClasses({ variant, size, fullWidth, className })}
        {...rest}
      >
        {loading ? (
          <Loader2
            size={isIconOnly ? 16 : 15}
            strokeWidth={2.2}
            className="animate-spin"
            aria-hidden="true"
          />
        ) : (
          <>
            {leadingIcon}
            {children}
            {trailingIcon}
          </>
        )}
      </button>
    );
  }
);
