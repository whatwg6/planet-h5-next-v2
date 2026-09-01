import type { ComponentType, SVGProps } from "react";
import { CustomerDetailChevronIcon } from "@/shared/assets/icons";

interface CustomerDetailActionProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  onClick?: () => void;
}

export function CustomerDetailAction({ icon: Icon, label, onClick }: CustomerDetailActionProps) {
  return (
    <button
      className="flex h-[72px] w-full items-center justify-between rounded-lg bg-background-container px-4 text-left"
      onClick={onClick}
      type="button"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3 pr-6">
        <Icon aria-hidden className="size-6 shrink-0 text-content-primary" />
        <span className="truncate text-[17px] font-medium leading-6 text-content-primary">
          {label}
        </span>
      </span>
      <CustomerDetailChevronIcon aria-hidden className="size-5 shrink-0 text-content-tertiary" />
    </button>
  );
}
