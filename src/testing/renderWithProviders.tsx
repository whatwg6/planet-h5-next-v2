import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { AppProviders } from "@/app/providers";

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AppProviders>
        <MemoryRouter>{children}</MemoryRouter>
      </AppProviders>
    ),
    ...options,
  });
}
