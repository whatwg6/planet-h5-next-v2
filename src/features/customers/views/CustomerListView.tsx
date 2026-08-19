import { useEffect, useMemo, useState } from "react";
import { EmptySearchIcon } from "@/shared/assets/icons/customer";
import { CustomerCard } from "../components/CustomerCard";
import { CustomerSearchField } from "../components/CustomerSearchField";

const customers = [
  { name: "美好科技集团" },
  { name: "星河控股集团星河控股集团星河控股集团", isTest: true },
  { name: "北京艾雅科技有限公司" },
  { name: "北京创新科技有限公司" },
  { name: "北京优美可视科技有限公司", isTest: true },
  { name: "上海艾莉森元宇宙有限公司" },
  { name: "上海大作为数据咨询有限公司" },
];

export function CustomerListView() {
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState("");
  const [settledQuery, setSettledQuery] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setSettledQuery("");
      return;
    }

    const timeout = window.setTimeout(() => setSettledQuery(query.trim()), 350);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const results = useMemo(() => {
    if (!settledQuery) return customers;
    return customers.filter(({ name }) => name.includes(settledQuery));
  }, [settledQuery]);

  const loading = active && Boolean(query.trim()) && query.trim() !== settledQuery;
  const showEmpty = active && Boolean(settledQuery) && !loading && results.length === 0;

  return (
    <main className="flex min-h-dvh w-full flex-col bg-background-base font-['PingFang_SC','PingFang_SC',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      <h1 className="sr-only">4.0 客户</h1>
      <CustomerSearchField
        active={active}
        onActiveChange={setActive}
        onChange={setQuery}
        value={query}
      />

      {loading ? (
        <div className="mt-[58px] flex justify-center" role="status" aria-label="正在搜索">
          <span className="flex h-3.5 items-center gap-[4.2px]" aria-hidden>
            {[7, 11, 8, 14, 7].map((height, index) => (
              <span
                className="w-[1.4px] bg-brand-foreground"
                key={`${height}-${index}`}
                style={{ height }}
              />
            ))}
          </span>
        </div>
      ) : showEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <EmptySearchIcon
            aria-hidden
            className="size-16 text-[color:var(--color-content-disabled)]"
          />
          <p className="text-[17px] font-medium leading-6 text-content-tertiary">无搜索结果</p>
        </div>
      ) : (
        <section aria-label="客户列表" className="flex flex-col gap-3 px-3 pb-5 pt-2">
          {results.map((customer) => (
            <CustomerCard key={customer.name} {...customer} />
          ))}
        </section>
      )}
    </main>
  );
}
