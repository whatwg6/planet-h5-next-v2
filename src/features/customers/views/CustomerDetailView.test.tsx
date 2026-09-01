import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";
import { renderWithProviders } from "@/testing/renderWithProviders";
import { CustomerDetailView } from "./CustomerDetailView";

function LocationProbe() {
  return <output aria-label="当前位置">{useLocation().pathname}</output>;
}

describe("CustomerDetailView", () => {
  it("renders customer details and opens meal plans", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route
          path="*"
          element={
            <>
              <CustomerDetailView />
              <LocationProbe />
            </>
          }
        />
      </Routes>,
    );

    expect(screen.getByRole("heading", { name: "美好科技有限公司" })).toBeVisible();
    expect(screen.getByText("测试客户")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "用餐计划" }));
    expect(screen.getByRole("status", { name: "当前位置" })).toHaveTextContent("/meal-plans");
  });

  it("opens customer settings", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route
          path="*"
          element={
            <>
              <CustomerDetailView />
              <LocationProbe />
            </>
          }
        />
      </Routes>,
    );

    await user.click(screen.getByRole("button", { name: "打开客户设置" }));
    expect(screen.getByRole("status", { name: "当前位置" })).toHaveTextContent("/settings");
  });
});
