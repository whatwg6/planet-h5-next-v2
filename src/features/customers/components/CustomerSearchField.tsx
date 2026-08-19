import { useRef } from "react";
import { ClearSearchIcon, SearchIcon } from "@/shared/assets/icons/customer";

interface CustomerSearchFieldProps {
  active: boolean;
  onActiveChange: (active: boolean) => void;
  onChange: (value: string) => void;
  value: string;
}

export function CustomerSearchField({
  active,
  onActiveChange,
  onChange,
  value,
}: CustomerSearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const cancel = () => {
    onChange("");
    onActiveChange(false);
    inputRef.current?.blur();
  };

  return (
    <div className={`flex items-center gap-3 py-3 ${active ? "pl-3 pr-2" : "px-3"}`}>
      <label className="flex h-10 min-w-0 flex-1 items-center rounded-md border border-container-border bg-background-component px-2">
        <span className="flex size-6 shrink-0 items-center justify-center" aria-hidden>
          <SearchIcon className="size-[18.2px] text-[color:var(--color-content-secondary)]" />
        </span>
        <input
          ref={inputRef}
          aria-label="搜索客户"
          autoComplete="off"
          className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-base leading-[22px] text-content-primary caret-brand-foreground outline-none placeholder:text-content-tertiary focus:border-0 focus:ring-0 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => onActiveChange(true)}
          placeholder="搜索"
          type="search"
          value={value}
        />
        {active && value && (
          <button
            aria-label="清空搜索"
            className="flex size-6 shrink-0 items-center justify-center rounded-full"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            type="button"
          >
            <ClearSearchIcon className="size-5 text-content-primary" />
          </button>
        )}
      </label>
      {active && (
        <button
          className="flex h-10 shrink-0 items-center px-1 text-base leading-[22px] text-brand-foreground"
          onClick={cancel}
          type="button"
        >
          取消
        </button>
      )}
    </div>
  );
}
