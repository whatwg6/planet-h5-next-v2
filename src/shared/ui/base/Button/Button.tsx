import { classNames } from "@/shared/lib";
import type { ButtonProps } from "./types";

const variants = {
  primary: "bg-primary text-white active:opacity-80",
  secondary: "border border-border bg-surface text-text active:bg-canvas",
  ghost: "bg-transparent text-primary active:bg-canvas",
};

export function Button({
  block = false,
  children,
  className,
  disabled,
  loading = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-control px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
        variants[variant],
        block && "w-full",
        className,
      )}
      disabled={disabled || loading}
      type={type}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? "处理中…" : children}
    </button>
  );
}
