import { Page } from "@/shared/ui";

export function HomeView() {
  return (
    <Page title="Planet H5">
      <section className="rounded-card bg-surface p-5 shadow-card">
        <p className="text-sm font-medium text-primary">工程基线已就绪</p>
        <h2 className="mt-2 text-2xl font-bold text-text">从清晰的边界开始生长。</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          App、Pages、Features、Services 与 Shared 已按单向依赖装配，可在真实需求明确后添加业务
          Feature。
        </p>
      </section>
    </Page>
  );
}
