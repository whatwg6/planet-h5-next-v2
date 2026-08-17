import { Button } from "@/shared/ui";
import { usePwaUpdate } from "../hooks/usePwaUpdate";

export function PwaUpdatePrompt() {
  const { close, needRefresh, update } = usePwaUpdate();
  if (!needRefresh) return null;

  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-toast mx-auto max-w-screen-sm rounded-card bg-surface p-4 shadow-card"
      role="status"
    >
      <p className="text-sm font-semibold text-text">发现新版本</p>
      <p className="mt-1 text-sm text-muted">请先保存正在编辑的内容，再刷新应用。</p>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" onClick={close}>
          稍后
        </Button>
        <Button onClick={() => void update()}>立即刷新</Button>
      </div>
    </aside>
  );
}
