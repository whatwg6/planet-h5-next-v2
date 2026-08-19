interface SettingSwitchProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

export function SettingSwitch({ checked, label, onChange }: SettingSwitchProps) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={`relative block h-[31px] w-[51px] shrink-0 appearance-none rounded-full border-0 p-0 transition-colors ${
        checked ? "bg-brand-background" : "bg-content-disabled"
      }`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        aria-hidden
        className={`absolute top-0.5 size-[27px] rounded-full bg-white shadow-[0_3px_8px_rgb(0_0_0/15%),0_3px_1px_rgb(0_0_0/6%)] transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
