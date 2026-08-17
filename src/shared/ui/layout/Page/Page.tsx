import type { PropsWithChildren, ReactNode } from "react";
import { classNames } from "@/shared/lib";

export interface PageProps extends PropsWithChildren {
  actions?: ReactNode;
  className?: string;
  title?: string;
}

export function Page({ actions, children, className, title }: PageProps) {
  return (
    <main
      className={classNames(
        "mx-auto min-h-dvh w-full max-w-screen-sm bg-canvas px-4 pb-safe pt-safe",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex min-h-14 items-center justify-between gap-3 py-2">
          {title && <h1 className="text-xl font-bold text-text">{title}</h1>}
          {actions}
        </header>
      )}
      {children}
    </main>
  );
}
