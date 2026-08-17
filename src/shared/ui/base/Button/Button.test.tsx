import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("responds to user activation", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>保存</Button>);
    await userEvent.click(screen.getByRole("button", { name: "保存" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("exposes a busy state and prevents activation", () => {
    render(<Button loading>保存</Button>);
    expect(screen.getByRole("button", { name: "处理中…" })).toBeDisabled();
  });
});
