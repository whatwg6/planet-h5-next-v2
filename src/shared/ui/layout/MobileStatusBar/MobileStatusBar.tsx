import { BatteryCapIcon, CellularIcon, WifiIcon } from "@/shared/assets/icons";

export function MobileStatusBar() {
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
