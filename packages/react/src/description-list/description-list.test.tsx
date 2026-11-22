import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { DescriptionList } from "./description-list";

describe("DescriptionList", () => {
  it("renders term and detail pairs as dt/dd", () => {
    render(
      <DescriptionList>
        <DescriptionList.Item term="Email">a@b.com</DescriptionList.Item>
      </DescriptionList>,
    );
    expect(screen.getByText("Email").tagName).toBe("DT");
    expect(screen.getByText("a@b.com").tagName).toBe("DD");
  });

  it("forwards refs to the dl and item elements", () => {
    const listRef = createRef<HTMLDListElement>();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <DescriptionList ref={listRef}>
        <DescriptionList.Item ref={itemRef} term="Plan">
          Pro
        </DescriptionList.Item>
      </DescriptionList>,
    );
    expect(listRef.current).toBeInstanceOf(HTMLDListElement);
    expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionList.Item term="Plan">Pro</DescriptionList.Item>
        <DescriptionList.Item term="Seats">5</DescriptionList.Item>
      </DescriptionList>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
