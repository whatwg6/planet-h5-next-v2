import { ChevronRightIcon, CustomerIcon } from "@/shared/assets/icons/customer";

interface CustomerCardProps {
  isTest?: boolean;
  name: string;
  onClick?: () => void;
}

export function CustomerCard({ isTest = false, name, onClick }: CustomerCardProps) {
  return (
    <button
      aria-label={`查看客户：${name}`}
      className="flex min-h-14 w-full items-start justify-between gap-6 rounded-xl border border-container-border bg-background-container p-4 text-left"
      onClick={onClick}
      type="button"
    >
      <span className="flex min-w-0 flex-1 items-start gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center" aria-hidden>
          <CustomerIcon className="h-[19px] w-[18px] text-content-tertiary" />
        </span>
        <span className="min-w-0 overflow-hidden text-[17px] font-medium leading-6 text-content-primary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {name}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 pt-0.5">
        {isTest && (
          <span className="rounded bg-brand-transparent px-1.5 py-[3px] text-[10px] font-medium leading-3 text-brand-foreground">
            测试
          </span>
        )}
        <span className="flex size-5 items-center justify-center" aria-hidden>
          <ChevronRightIcon className="h-3.5 w-2 -scale-x-100 text-content-tertiary" />
        </span>
      </span>
    </button>
  );
}
