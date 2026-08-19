import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/testing/renderWithProviders";
import { CustomerListView } from "./CustomerListView";

describe("CustomerListView", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows all customers by default", () => {
    renderWithProviders(<CustomerListView />);

    expect(screen.getAllByRole("button", { name: /查看客户/ })).toHaveLength(7);
  });

  it("searches customers and can cancel", () => {
    renderWithProviders(<CustomerListView />);

    const input = screen.getByRole("searchbox", { name: "搜索客户" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "美好科技" } });

    expect(screen.getByRole("status", { name: "正在搜索" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(350));
    expect(screen.getByRole("button", { name: "查看客户：美好科技集团" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "取消" }));
    expect(input).toHaveValue("");
    expect(screen.getAllByRole("button", { name: /查看客户/ })).toHaveLength(7);
  });

  it("shows the empty state for an unmatched customer", () => {
    renderWithProviders(<CustomerListView />);

    const input = screen.getByRole("searchbox", { name: "搜索客户" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "高斯科技" } });
    act(() => vi.advanceTimersByTime(350));

    expect(screen.getByText("无搜索结果")).toBeVisible();
  });
});
