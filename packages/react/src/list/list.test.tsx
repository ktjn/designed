import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { List } from "./list";

describe("List", () => {
  it("renders items with leading and trailing content including 0", () => {
    render(
      <List>
        <List.Item leading={<span>icon</span>} trailing={<span>action</span>}>
          Item label
        </List.Item>
        <List.Item leading={0} trailing={0}>
          Zero slots
        </List.Item>
      </List>,
    );
    expect(screen.getByText("Item label")).toBeTruthy();
    expect(screen.getByText("icon")).toBeTruthy();
    expect(screen.getByText("action")).toBeTruthy();
    expect(screen.getAllByText("0")).toHaveLength(2);
  });

  it("applies the contained variant class", () => {
    render(
      <List variant="contained" data-testid="list">
        <List.Item>One</List.Item>
      </List>,
    );
    expect(screen.getByTestId("list").className).toContain("contained");
  });

  it("forwards refs to the ul and li elements", () => {
    const listRef = createRef<HTMLUListElement>();
    const itemRef = createRef<HTMLLIElement>();
    render(
      <List ref={listRef}>
        <List.Item ref={itemRef}>One</List.Item>
      </List>,
    );
    expect(listRef.current).toBeInstanceOf(HTMLUListElement);
    expect(itemRef.current).toBeInstanceOf(HTMLLIElement);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <List>
        <List.Item>One</List.Item>
        <List.Item>Two</List.Item>
      </List>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
