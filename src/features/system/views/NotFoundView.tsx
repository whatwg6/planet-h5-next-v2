import { Link } from "react-router-dom";
import { Page } from "@/shared/ui";

export function NotFoundView() {
  return (
    <Page title="页面不存在">
      <Link className="inline-flex min-h-11 items-center text-sm font-semibold text-primary" to="/">
        返回首页
      </Link>
    </Page>
  );
}
