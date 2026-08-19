import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronIcon } from "@/shared/assets/icons";
import {
  MealPlanSegmentedControl,
  type MealPlanDisplayMode,
} from "../components/MealPlanSegmentedControl";
import { MealPlanRow } from "../components/MealPlanRow";

const mealPlans = [
  {
    name: "美好科技美好科技美好科技午餐",
    physicalDetail: "12:00 送达",
    qrDetail: "12:00 - 14:00",
  },
  {
    name: "美好科技午餐",
    physicalDetail: "12:00 送达",
    qrDetail: "18:00 - 20:00",
  },
  {
    name: "美好科技晚餐",
    physicalDetail: "18:00 送达",
    qrDetail: "18:00 送达",
  },
];

export function MealPlanListView() {
  const navigate = useNavigate();
  const [displayMode, setDisplayMode] = useState<MealPlanDisplayMode>("physical");

  return (
    <main className="min-h-dvh w-full bg-background-base font-['PingFang_SC',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-content-primary">
      <header className="relative flex h-11 items-center border-b border-container-border px-1.5">
        <button
          aria-label="返回"
          className="flex size-11 shrink-0 items-center justify-center"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ChevronIcon aria-hidden className="h-3.5 w-2 text-content-primary" />
        </button>
        <h1 className="pointer-events-none absolute left-1/2 max-w-[calc(100%-104px)] -translate-x-1/2 truncate text-center text-[17px] font-medium leading-6">
          美好科技-北京...用餐计划
        </h1>
      </header>

      <section aria-label="用餐计划" className="flex flex-col gap-2 px-4 pt-3">
        <MealPlanSegmentedControl onChange={setDisplayMode} value={displayMode} />
        <div className="overflow-hidden rounded-lg">
          {mealPlans.map((mealPlan) => (
            <MealPlanRow
              detail={displayMode === "physical" ? mealPlan.physicalDetail : mealPlan.qrDetail}
              key={mealPlan.name}
              name={mealPlan.name}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
