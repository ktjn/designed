import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Tabs } from "../tabs/tabs";
import { DirectionProvider } from "./direction-provider";

function SampleTabs() {
  return (
    <Tabs defaultValue="middle">
      <Tabs.List>
        <Tabs.Tab value="start">Start</Tabs.Tab>
        <Tabs.Tab value="middle">Middle</Tabs.Tab>
        <Tabs.Tab value="end">End</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="start">Start panel</Tabs.Panel>
      <Tabs.Panel value="middle">Middle panel</Tabs.Panel>
      <Tabs.Panel value="end">End panel</Tabs.Panel>
    </Tabs>
  );
}

describe("DirectionProvider", () => {
  it("sets DOM direction and updates how Base UI handles arrow keys", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <DirectionProvider direction="rtl" ref={ref}>
        <SampleTabs />
      </DirectionProvider>,
    );

    expect(ref.current?.dir).toBe("rtl");
    screen.getByRole("tab", { name: "Middle" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(
      screen.getByRole("tab", { name: "End" }),
    );

    rerender(
      <DirectionProvider ref={ref}>
        <SampleTabs />
      </DirectionProvider>,
    );

    expect(ref.current?.dir).toBe("ltr");
    screen.getByRole("tab", { name: "Middle" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(
      screen.getByRole("tab", { name: "Start" }),
    );
  });
});
