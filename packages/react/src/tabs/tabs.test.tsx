import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Tabs } from "./tabs";

function BasicTabs() {
  return (
    <Tabs defaultValue="account">
      <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="password">Password</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="account">Account settings</Tabs.Panel>
      <Tabs.Panel value="password">Password settings</Tabs.Panel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the panel for the default tab and hides the other", () => {
    render(<BasicTabs />);
    expect(screen.getByText("Account settings")).toBeTruthy();
    expect(screen.queryByText("Password settings")).toBeNull();
  });

  it("switches panels on tab click", async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);
    await user.click(screen.getByRole("tab", { name: "Password" }));
    expect(screen.getByText("Password settings")).toBeTruthy();
    expect(screen.queryByText("Account settings")).toBeNull();
  });

  it("switches panels via arrow keys", async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);
    screen.getByRole("tab", { name: "Account" }).focus();
    await user.keyboard("{ArrowRight}{Enter}");
    expect(screen.getByText("Password settings")).toBeTruthy();
  });

  it("reports the selected value via onValueChange", async () => {
    const user = userEvent.setup();
    let value: unknown;
    render(
      <Tabs defaultValue="account" onValueChange={(v) => (value = v)}>
        <Tabs.List>
          <Tabs.Tab value="account">Account</Tabs.Tab>
          <Tabs.Tab value="password">Password</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="account">Account settings</Tabs.Panel>
        <Tabs.Panel value="password">Password settings</Tabs.Panel>
      </Tabs>,
    );
    await user.click(screen.getByRole("tab", { name: "Password" }));
    expect(value).toBe("password");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<BasicTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
