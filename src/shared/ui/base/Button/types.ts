import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}
