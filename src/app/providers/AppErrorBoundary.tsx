import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from "react";
import { noopMonitoring } from "@/shared/monitoring";
import { ErrorState, Page } from "@/shared/ui";

interface State {
  error: unknown | null;
}

export class AppErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    noopMonitoring.captureError(error, { componentStack: info.componentStack });
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <Page>
          <ErrorState onRetry={() => window.location.reload()} />
        </Page>
      );
    }
    return this.props.children;
  }
}
