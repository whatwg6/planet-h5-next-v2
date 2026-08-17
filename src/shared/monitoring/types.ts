export interface MonitoringAdapter {
  captureError(error: unknown, context?: Record<string, unknown>): void;
  captureMessage(message: string, context?: Record<string, unknown>): void;
}

export const noopMonitoring: MonitoringAdapter = {
  captureError: () => undefined,
  captureMessage: () => undefined,
};
