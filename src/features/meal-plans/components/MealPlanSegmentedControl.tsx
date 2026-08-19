export type MealPlanDisplayMode = "physical" | "qr";

interface MealPlanSegmentedControlProps {
  onChange: (value: MealPlanDisplayMode) => void;
  value: MealPlanDisplayMode;
}

const options: Array<{ label: string; value: MealPlanDisplayMode }> = [
  { label: "实体卡", value: "physical" },
  { label: "二维码", value: "qr" },
];

export function MealPlanSegmentedControl({ onChange, value }: MealPlanSegmentedControlProps) {
  return (
    <div className="py-2">
      <div
        aria-label="用餐凭证类型"
        className="flex rounded-lg bg-background-component p-0.5"
        role="group"
      >
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              aria-pressed={selected}
              className={`relative min-h-[38px] min-w-0 flex-1 rounded-md px-2.5 text-[13px] leading-[18px] text-content-primary before:absolute before:-inset-y-[3px] before:inset-x-0 ${
                selected ? "bg-content-disabled font-medium" : "font-normal"
              }`}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span className="block truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
