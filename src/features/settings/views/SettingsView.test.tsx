import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsView } from "./SettingsView";

describe("SettingsView", () => {
  it("renders setting groups and toggles a switch independently", async () => {
    const user = userEvent.setup();

    render(<SettingsView />);

    expect(screen.getByRole("heading", { level: 1, name: "设置" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "账号设置" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "高级设置" })).toBeInTheDocument();

    const mealSwitch = screen.getByRole("switch", { name: "开启餐点功能" });
    const faceSwitch = screen.getByRole("switch", { name: "是否允许录入人脸" });

    expect(mealSwitch).toBeChecked();
    expect(faceSwitch).toBeChecked();

    await user.click(mealSwitch);

    expect(mealSwitch).not.toBeChecked();
    expect(faceSwitch).toBeChecked();
  });
});
