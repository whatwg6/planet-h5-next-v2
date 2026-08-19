import { useState } from "react";
import { BatteryCapIcon, CellularIcon, ChevronLeftIcon, WifiIcon } from "@/shared/assets/icons";
import { SettingGroup, type SettingItemData } from "../components/SettingGroup";
import { SettingSwitch } from "../components/SettingSwitch";

const baseItems: SettingItemData[] = [
  { detail: "美好科技北京", icon: "note", label: "名称与备注" },
  { detail: "0 个", icon: "announcement", label: "企业公告" },
  { icon: "meal-card", label: "餐次卡片" },
  { icon: "group", label: "用餐组" },
];

const accountItems: SettingItemData[] = [
  { icon: "account", label: "登录方式" },
  { icon: "field", label: "字段设置" },
  { icon: "department", label: "部门" },
  { detail: "9 个", icon: "cost-center", label: "成本中心" },
];

const addressItems: SettingItemData[] = [{ icon: "versions", label: "企业地址及目的地配置" }];

const advancedItems: SettingItemData[] = [
  { detail: "2 个", icon: "keyhole", label: "管理权限" },
  { detail: "未设置", detailTone: "warning", icon: "support", label: "客户支持" },
  { icon: "versions", label: "客户端最低版本" },
  { icon: "link", label: "关联美餐卡/码" },
  { icon: "link", label: "关联客户内部卡/码" },
  { icon: "face", label: "是否允许录入人脸" },
  { icon: "user", label: "账号迁移" },
  {
    description: "2025.11.17 18:18:23 自动关闭",
    icon: "mail",
    label: "用餐人员接收邮件和短信",
  },
];

function StatusBar() {
  return (
    <div aria-hidden className="relative h-[54px] w-full text-white">
      <span className="absolute left-[13.2%] top-[18px] text-[17px] font-semibold leading-[22px]">
        9:41
      </span>
      <span className="absolute right-[34px] top-[22px] h-[13px] w-[27px]">
        <span className="absolute inset-0 rounded-[4px] border border-white/35" />
        <span className="absolute bottom-[2px] left-[2px] top-[2px] w-[21px] rounded-[2.5px] bg-white" />
        <BatteryCapIcon className="absolute -right-[2px] top-[4px] h-1 w-[2px]" />
      </span>
      <WifiIcon className="absolute right-[67px] top-[23px] h-[13px] w-[18px]" />
      <CellularIcon className="absolute right-[93px] top-[23px] h-[13px] w-5" />
    </div>
  );
}

export function SettingsView() {
  const [mealEnabled, setMealEnabled] = useState(true);
  const [faceEnabled, setFaceEnabled] = useState(true);
  const [messageEnabled, setMessageEnabled] = useState(true);

  const paymentItems: SettingItemData[] = [
    { detail: "4 项", icon: "payment-card", label: "客户支付方式" },
    {
      icon: "meals",
      label: "开启餐点功能",
      trailing: (
        <SettingSwitch checked={mealEnabled} label="开启餐点功能" onChange={setMealEnabled} />
      ),
    },
    { icon: "meals", label: "餐点使用模式" },
  ];

  const hydratedAdvancedItems = advancedItems.map((item) => {
    if (item.label === "是否允许录入人脸") {
      return {
        ...item,
        trailing: (
          <SettingSwitch checked={faceEnabled} label="是否允许录入人脸" onChange={setFaceEnabled} />
        ),
      };
    }
    if (item.label === "用餐人员接收邮件和短信") {
      return {
        ...item,
        trailing: (
          <SettingSwitch
            checked={messageEnabled}
            label="用餐人员接收邮件和短信"
            onChange={setMessageEnabled}
          />
        ),
      };
    }
    return item;
  });

  return (
    <main className="relative h-dvh min-h-[568px] w-full overflow-hidden rounded-[48px] bg-background-base font-['PingFang_SC','PingFang_SC',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif text-content-primary">
      <h1 className="sr-only">设置</h1>
      <header className="absolute inset-x-0 top-0 z-10 border-b border-container-border bg-background-base">
        <StatusBar />
        <div className="relative flex h-11 items-center justify-between pl-1.5 pr-4">
          <button
            aria-label="返回"
            className="flex size-11 items-center justify-center text-content-primary"
            onClick={() => window.history.back()}
            type="button"
          >
            <ChevronLeftIcon aria-hidden className="h-[18px] w-2.5" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-medium leading-6">
            设置
          </span>
          <span aria-hidden className="h-11 w-[34px]" />
        </div>
      </header>

      <div className="h-full overflow-y-auto px-4 pb-[42px] pt-[110px]">
        <div className="flex w-full flex-col gap-2">
          <SettingGroup items={baseItems} />
          <SettingGroup items={accountItems} title="账号设置" />
          <SettingGroup items={paymentItems} title="支付设置" />
          <SettingGroup items={addressItems} title="地址设置" />
          <SettingGroup items={hydratedAdvancedItems} title="高级设置" />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[21px] bg-background-base"
      >
        <span className="absolute bottom-2 left-1/2 h-[5px] w-[139px] -translate-x-1/2 rounded-full bg-white" />
      </div>
    </main>
  );
}
