import axios from "axios";
import { AppError } from "./AppError";

const statusKinds = new Map<number, AppError["kind"]>([
  [401, "Unauthorized"],
  [403, "Forbidden"],
]);

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (!axios.isAxiosError(error)) {
    return new AppError("Unknown", "发生未知错误", { cause: error });
  }

  const status = error.response?.status;
  const requestId = error.response?.headers["x-request-id"] as string | undefined;
  const options = { cause: error, requestId, status };

  if (error.code === "ERR_CANCELED") return new AppError("Cancelled", "请求已取消", options);
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new AppError("Timeout", "请求超时，请稍后重试", options);
  }
  if (!error.response) return new AppError("Network", "网络连接失败", options);
  const statusKind = status === undefined ? undefined : statusKinds.get(status);
  if (statusKind) return new AppError(statusKind, "没有访问权限", options);
  if (status !== undefined && status >= 500)
    return new AppError("Server", "服务暂时不可用", options);
  return new AppError("Unknown", error.message || "请求失败", options);
}
