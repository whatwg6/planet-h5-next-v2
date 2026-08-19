import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/testing/renderWithProviders";
import { MealPlanListView } from "./MealPlanListView";

describe("MealPlanListView", () => {
  it("shows physical-card delivery details by default", () => {
    renderWithProviders(<MealPlanListView />);

    expect(screen.getByRole("button", { name: "实体卡" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByText("12:00 送达")).toHaveLength(2);
  });

  it("switches to QR-code availability ranges", () => {
    renderWithProviders(<MealPlanListView />);

    fireEvent.click(screen.getByRole("button", { name: "二维码" }));

    expect(screen.getByRole("button", { name: "二维码" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("12:00 - 14:00")).toBeVisible();
    expect(screen.getByText("18:00 - 20:00")).toBeVisible();
  });
});
