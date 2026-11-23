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

  it("supports small tabs while preserving keyboard activation", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="account">
        <Tabs.List>
          <Tabs.Tab value="account" size="small">
            Account
          </Tabs.Tab>
          <Tabs.Tab value="password" size="small">
            Password
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="account">Account settings</Tabs.Panel>
        <Tabs.Panel value="password">Password settings</Tabs.Panel>
      </Tabs>,
    );
    const account = screen.getByRole("tab", { name: "Account" });
    expect(account.getAttribute("data-size")).toBe("small");
    expect(account.hasAttribute("size")).toBe(false);
    account.focus();
    await user.keyboard("{ArrowRight}{Enter}");
    expect(screen.getByRole("tabpanel").textContent).toBe("Password settings");
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

  it("exposes the vertical orientation on the tablist", () => {
    render(
      <Tabs defaultValue="account" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="account">Account</Tabs.Tab>
          <Tabs.Tab value="password">Password</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="account">Account settings</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe(
      "vertical",
    );
  });

  it("keeps an inactive panel's DOM mounted when keepMounted is set", () => {
    render(
      <Tabs defaultValue="account">
        <Tabs.List>
          <Tabs.Tab value="account">Account</Tabs.Tab>
          <Tabs.Tab value="password">Password</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="account">Account settings</Tabs.Panel>
        <Tabs.Panel value="password" keepMounted>
          Password settings
        </Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByText("Password settings")).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<BasicTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });

  // Regression test for a real bug: the CSS targeted [data-selected] for the
  // active-tab underline, but Base UI's Tab sets [data-active] instead, so
  // the indicator never rendered (found via a manual Storybook review).
  it("marks the selected tab with data-active, not data-selected", () => {
    render(<BasicTabs />);
    const account = screen.getByRole("tab", { name: "Account" });
    const password = screen.getByRole("tab", { name: "Password" });
    expect(account.hasAttribute("data-active")).toBe(true);
    expect(password.hasAttribute("data-active")).toBe(false);
  });
});
