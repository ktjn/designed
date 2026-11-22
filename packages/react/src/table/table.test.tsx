import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, type RefObject, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "../checkbox/checkbox";
import { Table, type TableSortDirection } from "./table";

function SortableDemo({ onSort }: { onSort: () => void }) {
  const [direction, setDirection] = useState<TableSortDirection>("none");
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head
            sortDirection={direction}
            onSort={() => {
              onSort();
              setDirection((prev) =>
                prev === "none"
                  ? "ascending"
                  : prev === "ascending"
                    ? "descending"
                    : "none",
              );
            }}
          >
            Amount
          </Table.Head>
          <Table.Head>Notes</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>$120.00</Table.Cell>
          <Table.Cell>Paid</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}

function ExpandableDemo({
  buttonRef,
  expandedRowRef,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  expandedRowRef: RefObject<HTMLTableRowElement | null>;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Details</Table.Head>
          <Table.Head>Invoice</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row expanded={expanded}>
          <Table.Cell>
            <Table.ExpandButton
              ref={buttonRef}
              expanded={expanded}
              onClick={() => setExpanded((prev) => !prev)}
            />
          </Table.Cell>
          <Table.Cell>INV-101</Table.Cell>
        </Table.Row>
        <Table.ExpandedRow
          ref={expandedRowRef}
          colSpan={2}
          open={expanded}
          cellClassName="custom-detail-cell"
        >
          Expanded details for INV-101
        </Table.ExpandedRow>
      </Table.Body>
    </Table>
  );
}

const SELECTABLE_ITEMS = [
  { id: "a", name: "Alpha" },
  { id: "b", name: "Beta" },
];

function SelectableDemo() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected = selectedIds.length === SELECTABLE_ITEMS.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>
            <Checkbox
              aria-label="Select all rows"
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={(checked) =>
                setSelectedIds(
                  checked ? SELECTABLE_ITEMS.map((item) => item.id) : [],
                )
              }
            />
          </Table.Head>
          <Table.Head>Name</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {SELECTABLE_ITEMS.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <Table.Row key={item.id} selected={isSelected}>
              <Table.Cell>
                <Checkbox
                  aria-label={`Select ${item.name}`}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    setSelectedIds((prev) =>
                      checked
                        ? [...prev, item.id]
                        : prev.filter((id) => id !== item.id),
                    )
                  }
                />
              </Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

describe("Table", () => {
  it("renders semantic table structure with caption, header, body, and footer", () => {
    render(
      <Table>
        <Table.Caption>Monthly invoices</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Amount</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>INV-001</Table.Cell>
            <Table.Cell>$120.00</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
            <Table.Cell>$120.00</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>,
    );

    expect(
      screen.getByRole("table", { name: "Monthly invoices" }),
    ).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toBeTruthy();
    expect(screen.getByRole("cell", { name: "INV-001" })).toBeTruthy();
  });

  it("exposes a data-slot wrapper and accepts wrapperClassName", () => {
    render(
      <Table wrapperClassName="custom-wrapper">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Cell</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const wrapper = screen
      .getByRole("table")
      .closest('[data-slot="table-wrapper"]');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.className).toContain("custom-wrapper");
    expect(wrapper?.hasAttribute("tabindex")).toBe(false);
  });

  it("supports sortable headers with aria-sort, sort button, icons, and onSort", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    render(<SortableDemo onSort={onSort} />);

    const amountHeader = screen.getByRole("columnheader", { name: "Amount" });
    const notesHeader = screen.getByRole("columnheader", { name: "Notes" });
    const sortButton = screen.getByRole("button", { name: "Amount" });

    expect(amountHeader.getAttribute("aria-sort")).toBe("none");
    expect(notesHeader.hasAttribute("aria-sort")).toBe(false);
    expect(notesHeader.querySelector("button")).toBeNull();
    expect(sortButton.getAttribute("type")).toBe("button");
    expect(sortButton.getAttribute("data-slot")).toBe("table-sort-button");

    const noneSvg = sortButton.querySelector("svg");
    expect(noneSvg?.getAttribute("aria-hidden")).toBe("true");
    const noneMarkup = noneSvg?.innerHTML;

    await user.click(sortButton);
    expect(onSort).toHaveBeenCalledTimes(1);
    expect(amountHeader.getAttribute("aria-sort")).toBe("ascending");
    const ascSvg = sortButton.querySelector("svg");
    expect(ascSvg?.getAttribute("aria-hidden")).toBe("true");
    const ascMarkup = ascSvg?.innerHTML;
    expect(ascMarkup).not.toBe(noneMarkup);

    await user.click(sortButton);
    expect(onSort).toHaveBeenCalledTimes(2);
    expect(amountHeader.getAttribute("aria-sort")).toBe("descending");
    const descSvg = sortButton.querySelector("svg");
    expect(descSvg?.getAttribute("aria-hidden")).toBe("true");
    const descMarkup = descSvg?.innerHTML;
    expect(descMarkup).not.toBe(ascMarkup);
    expect(descMarkup).not.toBe(noneMarkup);
  });

  it("sets data-sticky-header on table and wrapper, and data-sticky on Table.Header", () => {
    render(
      <Table stickyHeader>
        <Table.Header sticky>
          <Table.Row>
            <Table.Head>Column</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Value</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    const table = screen.getByRole("table");
    const wrapper = table.closest('[data-slot="table-wrapper"]');
    const header = table.querySelector('[data-slot="table-header"]');

    expect(table.hasAttribute("data-sticky-header")).toBe(true);
    expect(wrapper?.hasAttribute("data-sticky-header")).toBe(true);
    expect(wrapper?.getAttribute("tabindex")).toBe("0");
    expect(header?.hasAttribute("data-sticky")).toBe(true);
  });

  it("sets data-selected and data-expanded on Table.Row without aria-selected", () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row selected expanded>
            <Table.Cell>Row 1</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Row 2</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    const rows = screen.getAllByRole("row");
    expect(rows[0]?.hasAttribute("data-selected")).toBe(true);
    expect(rows[0]?.hasAttribute("data-expanded")).toBe(true);
    expect(rows[0]?.hasAttribute("aria-selected")).toBe(false);
    expect(rows[1]?.hasAttribute("data-selected")).toBe(false);
    expect(rows[1]?.hasAttribute("data-expanded")).toBe(false);
  });

  it("renders Table.ExpandButton and Table.ExpandedRow with labels, state, colSpan, and refs", async () => {
    const user = userEvent.setup();
    const buttonRef = createRef<HTMLButtonElement>();
    const expandedRowRef = createRef<HTMLTableRowElement>();

    render(
      <ExpandableDemo buttonRef={buttonRef} expandedRowRef={expandedRowRef} />,
    );

    const expandButton = screen.getByRole("button", { name: "Expand row" });
    expect(buttonRef.current).toBe(expandButton);
    expect(expandButton.getAttribute("data-slot")).toBe("table-expand-button");
    expect(expandButton.getAttribute("aria-expanded")).toBe("false");
    expect(expandButton.hasAttribute("data-expanded")).toBe(false);
    expect(expandButton.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(screen.queryByText("Expanded details for INV-101")).toBeNull();
    expect(expandedRowRef.current).toBeNull();

    await user.click(expandButton);

    const collapseButton = screen.getByRole("button", { name: "Collapse row" });
    expect(collapseButton.getAttribute("aria-expanded")).toBe("true");
    expect(collapseButton.hasAttribute("data-expanded")).toBe(true);

    const detailCell = screen
      .getByText("Expanded details for INV-101")
      .closest("td");
    const detailRow = detailCell?.closest("tr");
    expect(expandedRowRef.current).toBe(detailRow);
    expect(detailRow?.getAttribute("data-slot")).toBe("table-expanded-row");
    expect(detailCell?.getAttribute("data-slot")).toBe("table-expanded-cell");
    expect(detailCell?.getAttribute("colspan")).toBe("2");
    expect(detailCell?.className).toContain("custom-detail-cell");
  });

  it("renders a sort button without aria-sort when onSort is given without sortDirection", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head onSort={onSort}>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Paid</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    const header = screen.getByRole("columnheader", { name: "Status" });
    const button = screen.getByRole("button", { name: "Status" });
    expect(header.hasAttribute("aria-sort")).toBe(false);
    expect(button.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );

    await user.click(button);
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("supports custom labels and aria-label override on Table.ExpandButton and default open on Table.ExpandedRow", () => {
    const { rerender } = render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Table.ExpandButton
                expanded={false}
                expandLabel="Show INV-1"
                collapseLabel="Hide INV-1"
              />
            </Table.Cell>
          </Table.Row>
          <Table.ExpandedRow colSpan={1}>Always open</Table.ExpandedRow>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByRole("button", { name: "Show INV-1" })).toBeTruthy();
    expect(screen.getByText("Always open")).toBeTruthy();

    rerender(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Table.ExpandButton
                expanded
                expandLabel="Show INV-1"
                collapseLabel="Hide INV-1"
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByRole("button", { name: "Hide INV-1" })).toBeTruthy();

    rerender(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Table.ExpandButton
                expanded={false}
                aria-label="Custom explicit label"
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(
      screen.getByRole("button", { name: "Custom explicit label" }),
    ).toBeTruthy();
  });

  it("supports row selection with Checkbox including indeterminate select-all", async () => {
    const user = userEvent.setup();

    render(<SelectableDemo />);

    const selectAll = screen.getByRole("checkbox", { name: "Select all rows" });
    const selectAlpha = screen.getByRole("checkbox", { name: "Select Alpha" });
    const selectBeta = screen.getByRole("checkbox", { name: "Select Beta" });

    expect(selectAll.getAttribute("aria-checked")).toBe("false");

    await user.click(selectAlpha);
    expect(selectAll.getAttribute("aria-checked")).toBe("mixed");
    expect(selectAlpha.closest("tr")?.hasAttribute("data-selected")).toBe(true);
    expect(selectBeta.closest("tr")?.hasAttribute("data-selected")).toBe(false);

    await user.click(selectBeta);
    expect(selectAll.getAttribute("aria-checked")).toBe("true");
    expect(selectBeta.closest("tr")?.hasAttribute("data-selected")).toBe(true);

    await user.click(selectAll);
    expect(selectAll.getAttribute("aria-checked")).toBe("false");
    expect(selectAlpha.closest("tr")?.hasAttribute("data-selected")).toBe(
      false,
    );
    expect(selectBeta.closest("tr")?.hasAttribute("data-selected")).toBe(false);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Table stickyHeader>
        <Table.Caption>Members</Table.Caption>
        <Table.Header sticky>
          <Table.Row>
            <Table.Head>
              <Checkbox aria-label="Select all members" indeterminate />
            </Table.Head>
            <Table.Head>Details</Table.Head>
            <Table.Head sortDirection="ascending" onSort={() => {}}>
              Name
            </Table.Head>
            <Table.Head sortDirection="none" onSort={() => {}}>
              Role
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row selected expanded>
            <Table.Cell>
              <Checkbox aria-label="Select Alex" checked />
            </Table.Cell>
            <Table.Cell>
              <Table.ExpandButton expanded onClick={() => {}} />
            </Table.Cell>
            <Table.Cell>Alex</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
          <Table.ExpandedRow colSpan={4} open>
            Member since 2024
          </Table.ExpandedRow>
          <Table.Row>
            <Table.Cell>
              <Checkbox aria-label="Select Sam" />
            </Table.Cell>
            <Table.Cell>
              <Table.ExpandButton expanded={false} onClick={() => {}} />
            </Table.Cell>
            <Table.Cell>Sam</Table.Cell>
            <Table.Cell>Editor</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
