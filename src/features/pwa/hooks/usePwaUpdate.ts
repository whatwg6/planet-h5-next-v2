import { useRegisterSW } from "virtual:pwa-register/react";

export function usePwaUpdate() {
  const registration = useRegisterSW({
    onRegisterError(error) {
      if (import.meta.env.DEV) console.error("Service Worker 注册失败", error);
    },
  });

  return {
    needRefresh: registration.needRefresh[0],
    close: () => registration.needRefresh[1](false),
    update: () => registration.updateServiceWorker(true),
  };
}
