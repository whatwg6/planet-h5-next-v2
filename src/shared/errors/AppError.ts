export type AppErrorKind =
  "Network" | "Timeout" | "Unauthorized" | "Forbidden" | "Server" | "Cancelled" | "Unknown";

export interface AppErrorOptions {
  cause?: unknown;
  code?: string;
  requestId?: string;
  status?: number;
}

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly code?: string;
  readonly requestId?: string;
  readonly status?: number;

  constructor(kind: AppErrorKind, message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.kind = kind;
    this.code = options.code;
    this.requestId = options.requestId;
    this.status = options.status;
  }
}
