import { PwaUpdatePrompt } from "@/features/pwa";
import { AppErrorBoundary, AppProviders } from "./providers";
import { AppRouter } from "./router/AppRouter";

export function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <AppRouter />
        <PwaUpdatePrompt />
      </AppProviders>
    </AppErrorBoundary>
  );
}
