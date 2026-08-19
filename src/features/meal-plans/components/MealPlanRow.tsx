import { ChevronIcon } from "@/shared/assets/icons";

interface MealPlanRowProps {
  detail: string;
  name: string;
  onClick?: () => void;
}

export function MealPlanRow({ detail, name, onClick }: MealPlanRowProps) {
  return (
    <button
      aria-label={`${name}，${detail}`}
      className="relative flex min-h-14 w-full items-center gap-2 bg-background-container px-4 py-3 text-left after:absolute after:bottom-0 after:left-4 after:right-0 after:h-px after:bg-divider last:after:hidden"
      onClick={onClick}
      type="button"
    >
      <span className="min-w-0 max-w-[180px] flex-1 truncate text-base font-medium leading-[22px] text-content-primary">
        {name}
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-1 text-base font-normal leading-[22px] text-content-secondary">
        <span>{detail}</span>
        <span className="flex size-5 items-center justify-center" aria-hidden>
          <ChevronIcon className="h-3 w-[7px] -scale-x-100" />
        </span>
      </span>
    </button>
  );
}
