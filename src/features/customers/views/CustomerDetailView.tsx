import { useNavigate } from "react-router-dom";
import {
  CustomerDetailBackIcon,
  CustomerDetailInfoIcon,
  CustomerDetailSettingsIcon,
  DestinationIcon,
  MealPlanIcon,
} from "@/shared/assets/icons";
import { MobileStatusBar } from "@/shared/ui";
import { CustomerDetailAction } from "../components/CustomerDetailAction";

export function CustomerDetailView() {
  const navigate = useNavigate();

  return (
    <main className="relative h-dvh min-h-[568px] w-full overflow-hidden bg-[#4b4b4b] font-['PingFang_SC',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif text-content-primary">
      <div className="absolute inset-0 overflow-hidden rounded-[48px] bg-background-base">
        <header className="absolute inset-x-0 top-0 z-10 border-b border-container-border bg-background-base">
          <MobileStatusBar />
          <nav aria-label="客户详情导航" className="flex h-11 items-center justify-between px-1.5">
            <button
              aria-label="返回客户列表"
              className="flex size-11 items-center justify-center text-content-primary"
              onClick={() => navigate(-1)}
              type="button"
            >
              <CustomerDetailBackIcon aria-hidden className="size-6" />
            </button>
            <button
              aria-label="打开客户设置"
              className="flex size-11 items-center justify-center text-content-primary"
              onClick={() => navigate("/settings")}
              type="button"
            >
              <CustomerDetailSettingsIcon aria-hidden className="size-6" />
            </button>
          </nav>
        </header>

        <div className="absolute inset-x-0 top-[110px] flex flex-col gap-5">
          <div className="px-4">
            <h1 className="px-1 pb-1 pt-4 text-[28px] font-medium leading-[34px]">
              美好科技有限公司
            </h1>
          </div>

          <div className="px-4">
            <div className="flex min-h-12 items-center gap-3 rounded-lg bg-background-container px-4 py-3.5">
              <CustomerDetailInfoIcon
                aria-hidden
                className="size-5 shrink-0 text-content-primary"
              />
              <p className="min-w-0 flex-1 text-[15px] font-medium leading-5">测试客户</p>
            </div>
          </div>

          <section aria-label="客户功能" className="flex flex-col gap-2 px-4">
            <CustomerDetailAction
              icon={MealPlanIcon}
              label="用餐计划"
              onClick={() => navigate("/meal-plans")}
            />
            <CustomerDetailAction icon={DestinationIcon} label="目的地" />
          </section>
        </div>

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[21px]">
          <span className="absolute bottom-2 left-1/2 h-[5px] w-[139px] -translate-x-1/2 rounded-full bg-white" />
        </div>
      </div>
    </main>
  );
}
