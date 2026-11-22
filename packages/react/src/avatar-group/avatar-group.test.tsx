import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Avatar } from "../avatar/avatar";
import avatarStyles from "../avatar/avatar.module.css";
import { AvatarGroup } from "./avatar-group";
import styles from "./avatar-group.module.css";

describe("AvatarGroup", () => {
  it("renders all avatars when max is omitted", () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
        <Avatar alt="Alan Turing" fallback="AT" />
      </AvatarGroup>,
    );

    expect(screen.getByText("AL")).toBeTruthy();
    expect(screen.getByText("GH")).toBeTruthy();
    expect(screen.getByText("AT")).toBeTruthy();
    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(3);
    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]'),
    ).toBeNull();
  });

  it("truncates avatars when max is set and renders accessible +N overflow counter", () => {
    const { container } = render(
      <AvatarGroup max={2}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
        <Avatar alt="Alan Turing" fallback="AT" />
        <Avatar alt="Katherine Johnson" fallback="KJ" />
      </AvatarGroup>,
    );

    expect(screen.getByText("AL")).toBeTruthy();
    expect(screen.getByText("GH")).toBeTruthy();
    expect(screen.queryByText("AT")).toBeNull();
    expect(screen.queryByText("KJ")).toBeNull();
    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(2);

    const overflow = container.querySelector(
      '[data-slot="avatar-group-overflow"]',
    );
    expect(overflow).not.toBeNull();
    expect(overflow?.textContent).toBe("+2");
    expect(overflow?.getAttribute("aria-label")).toBe("2 more");
  });

  it("does not render overflow counter when max is greater than or equal to avatar count", () => {
    const { container } = render(
      <AvatarGroup max={3}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
      </AvatarGroup>,
    );

    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(2);
    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]'),
    ).toBeNull();
  });

  it("handles max={0}, negative max, and fractional max", () => {
    const { container, rerender } = render(
      <AvatarGroup max={0}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
        <Avatar alt="Alan Turing" fallback="AT" />
      </AvatarGroup>,
    );

    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(0);
    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]')
        ?.textContent,
    ).toBe("+3");

    rerender(
      <AvatarGroup max={-4}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
      </AvatarGroup>,
    );

    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(0);
    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]')
        ?.textContent,
    ).toBe("+2");

    rerender(
      <AvatarGroup max={1.9}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
        <Avatar alt="Alan Turing" fallback="AT" />
      </AvatarGroup>,
    );

    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(1);
    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]')
        ?.textContent,
    ).toBe("+2");
  });

  it("treats max={Infinity} and max={NaN} as unbounded and clamps -Infinity to 0", () => {
    const { container, rerender } = render(
      <AvatarGroup max={Number.POSITIVE_INFINITY}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
        <Avatar alt="Alan Turing" fallback="AT" />
      </AvatarGroup>,
    );

    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(3);
    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]'),
    ).toBeNull();

    rerender(
      <AvatarGroup max={Number.NaN}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
        <Avatar alt="Alan Turing" fallback="AT" />
      </AvatarGroup>,
    );

    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(3);
    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]'),
    ).toBeNull();

    rerender(
      <AvatarGroup max={Number.NEGATIVE_INFINITY}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
      </AvatarGroup>,
    );

    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(0);
    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]')
        ?.textContent,
    ).toBe("+2");
  });

  it("ignores null, undefined, booleans, and empty strings in children", () => {
    const { container } = render(
      <AvatarGroup max={2}>
        {null}
        {undefined}
        {false}
        {true}
        {""}
        <Avatar alt="Ada Lovelace" fallback="AL" />
        {""}
        <Avatar alt="Grace Hopper" fallback="GH" />
      </AvatarGroup>,
    );

    expect(
      container.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(2);
    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]'),
    ).toBeNull();
  });

  it("propagates size to direct Avatar children while preserving explicit Avatar size", () => {
    const { container } = render(
      <AvatarGroup size="small" max={2}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" size="large" />
        <Avatar alt="Alan Turing" fallback="AT" />
      </AvatarGroup>,
    );

    const root = container.querySelector('[data-slot="avatar-group"]');
    expect(root?.getAttribute("data-size")).toBe("small");

    const avatars = container.querySelectorAll('[data-slot="avatar"]');
    expect(avatars).toHaveLength(2);
    expect(avatars[0]?.className).toContain(avatarStyles.small);
    expect(avatars[1]?.className).toContain(avatarStyles.large);

    const overflow = container.querySelector(
      '[data-slot="avatar-group-overflow"]',
    );
    expect(overflow?.className).toContain(styles.small);
  });

  it("supports custom renderOverflow and overflowLabel", () => {
    const { container, rerender } = render(
      <AvatarGroup
        max={1}
        overflowLabel={(count) => `${count} additional collaborators`}
      >
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
        <Avatar alt="Alan Turing" fallback="AT" />
      </AvatarGroup>,
    );

    const defaultOverflow = container.querySelector(
      '[data-slot="avatar-group-overflow"]',
    );
    expect(defaultOverflow?.getAttribute("aria-label")).toBe(
      "2 additional collaborators",
    );

    rerender(
      <AvatarGroup
        max={1}
        renderOverflow={(count) => (
          <button type="button" data-testid="custom-overflow">
            Show {count} more
          </button>
        )}
      >
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
        <Avatar alt="Alan Turing" fallback="AT" />
      </AvatarGroup>,
    );

    expect(
      container.querySelector('[data-slot="avatar-group-overflow"]'),
    ).toBeNull();
    expect(screen.getByTestId("custom-overflow").textContent).toBe(
      "Show 2 more",
    );
  });

  it("flattens nested and sibling Fragment children without duplicate key warnings", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const nestedGroup = (
      <>
        <Avatar alt="Grace Hopper" fallback="GH" />
        {null}
        {""}
      </>
    );
    const firstGroup = (
      <>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        {nestedGroup}
      </>
    );
    const secondGroup = (
      <>
        <Avatar alt="Alan Turing" fallback="AT" />
        <Avatar alt="Katherine Johnson" fallback="KJ" />
      </>
    );

    try {
      const { container } = render(
        <AvatarGroup max={4}>
          {firstGroup}
          {secondGroup}
          <Avatar alt="Margaret Hamilton" fallback="MH" />
        </AvatarGroup>,
      );

      expect(
        container.querySelectorAll('[data-slot="avatar-group-item"]'),
      ).toHaveLength(4);
      expect(screen.getByText("AL")).toBeTruthy();
      expect(screen.getByText("GH")).toBeTruthy();
      expect(screen.getByText("AT")).toBeTruthy();
      expect(screen.getByText("KJ")).toBeTruthy();
      expect(screen.queryByText("MH")).toBeNull();
      expect(
        container.querySelector('[data-slot="avatar-group-overflow"]')
          ?.textContent,
      ).toBe("+1");
      expect(errorSpy).not.toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
    }
  });

  it("forwards ref, className, and HTML attributes to root element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <AvatarGroup
        ref={ref}
        className="custom-group"
        id="team-avatars"
        aria-label="Team members"
      >
        <Avatar alt="Ada Lovelace" fallback="AL" />
      </AvatarGroup>,
    );

    const root = container.querySelector('[data-slot="avatar-group"]');
    expect(ref.current).toBe(root);
    expect(ref.current?.className).toContain(styles.root);
    expect(ref.current?.className).toContain("custom-group");
    expect(ref.current?.id).toBe("team-avatars");
    expect(ref.current?.getAttribute("aria-label")).toBe("Team members");
    expect(ref.current?.getAttribute("data-size")).toBe("medium");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <AvatarGroup max={2}>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" fallback="GH" />
        <Avatar alt="Alan Turing" fallback="AT" />
        <Avatar alt="Katherine Johnson" fallback="KJ" />
      </AvatarGroup>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
