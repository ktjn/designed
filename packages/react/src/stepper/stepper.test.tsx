import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Stepper } from "./stepper.js";

const STEPS = [
  { id: "account", label: "Account", description: "Create credentials" },
  { id: "workspace", label: "Workspace", description: "Configure team" },
  { id: "review", label: "Review", description: "Confirm settings" },
];

describe("Stepper", () => {
  it("renders ordered steps and marks the active step with aria-current", () => {
    render(<Stepper steps={STEPS} currentStep={1} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]?.getAttribute("data-status")).toBe("complete");
    expect(items[1]?.getAttribute("aria-current")).toBe("step");
    expect(items[1]?.getAttribute("data-status")).toBe("current");
    expect(items[2]?.getAttribute("data-status")).toBe("upcoming");
  });

  it("supports vertical orientation with no axe violations", async () => {
    const { container } = render(
      <Stepper
        steps={STEPS}
        currentStep={0}
        orientation="vertical"
        aria-label="Onboarding steps"
      />,
    );

    expect(screen.getByRole("list", { name: "Onboarding steps" })).toBeTruthy();
    expect(await axe(container)).toHaveNoViolations();
  });
});
