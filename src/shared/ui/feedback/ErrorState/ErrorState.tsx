import { Button } from "@/shared/ui/base/Button";

export interface ErrorStateProps {
  description?: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({
  description = "请稍后重试。",
  onRetry,
  title = "页面暂时无法显示",
}: ErrorStateProps) {
  return (
    <section
      className="flex min-h-[50dvh] flex-col items-center justify-center gap-3 px-6 text-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      <p className="text-sm text-muted">{description}</p>
      {onRetry && <Button onClick={onRetry}>重试</Button>}
    </section>
  );
}
