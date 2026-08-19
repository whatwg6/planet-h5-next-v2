import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/shared/assets/icons";
import { SettingsIcon, type SettingsIconName } from "./SettingsIcons";

export interface SettingItemData {
  description?: string;
  detail?: string;
  detailTone?: "default" | "warning";
  icon: SettingsIconName;
  label: string;
  trailing?: ReactNode;
}

interface SettingGroupProps {
  items: SettingItemData[];
  title?: string;
}

function SettingItemContent({ item }: { item: SettingItemData }) {
  return (
    <>
      <SettingsIcon name={item.icon} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-medium leading-[22px]">{item.label}</span>
        {item.description && (
          <span className="mt-0.5 block truncate text-[13px] font-normal leading-[18px] text-content-secondary">
            {item.description}
          </span>
        )}
      </span>
      <span className="ml-auto flex min-w-0 shrink items-center gap-1 pl-3">
        {item.detail && (
          <span
            className={`truncate text-right font-normal ${
              item.detailTone === "warning"
                ? "text-[17px] leading-6 text-functional-yellow"
                : "max-w-[200px] text-base leading-[22px] text-content-secondary"
            }`}
          >
            {item.detail}
          </span>
        )}
        {item.trailing ?? (
          <ChevronRightIcon
            aria-hidden
            className="h-5 w-5 shrink-0 -scale-x-100 p-[3px] text-content-tertiary"
          />
        )}
      </span>
    </>
  );
}

export function SettingGroup({ items, title }: SettingGroupProps) {
  return (
    <section aria-label={title ?? "基础设置"} className="w-full">
      {title && (
        <h2 className="px-4 pb-3 pt-3 text-[15px] font-medium leading-5 text-content-secondary">
          {title}
        </h2>
      )}
      <div className="overflow-hidden rounded-lg bg-background-container">
        {items.map((item, index) => (
          <div className="relative" key={item.label}>
            {item.trailing ? (
              <div className="flex min-h-14 w-full items-center gap-2 px-4 py-3 text-content-primary">
                <SettingItemContent item={item} />
              </div>
            ) : (
              <button
                className="flex min-h-14 w-full items-center gap-2 px-4 py-3 text-left text-content-primary"
                type="button"
              >
                <SettingItemContent item={item} />
              </button>
            )}
            {index < items.length - 1 && (
              <span aria-hidden className="absolute bottom-0 left-4 right-0 h-px bg-divider" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
