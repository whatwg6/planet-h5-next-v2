import { Page } from "@/shared/ui";

export function OfflineView() {
  return (
    <Page title="当前离线">
      <p className="rounded-card bg-surface p-5 text-sm leading-6 text-muted shadow-card">
        应用外壳仍可访问，但业务数据不会被缓存。恢复网络后请重新尝试。
      </p>
    </Page>
  );
}
