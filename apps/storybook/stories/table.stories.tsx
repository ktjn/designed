import { Badge, Checkbox, Table } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Table> = {
  title: "Table",
  component: Table,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <Table.Caption>Recent invoices</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>INV-104</Table.Cell>
          <Table.Cell>
            <Badge variant="success">Paid</Badge>
          </Table.Cell>
          <Table.Cell>$240.00</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>INV-105</Table.Cell>
          <Table.Cell>
            <Badge variant="warning">Pending</Badge>
          </Table.Cell>
          <Table.Cell>$180.00</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={2}>Total</Table.Cell>
          <Table.Cell>$420.00</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  ),
};

interface InvoiceItem {
  id: string;
  status: "Paid" | "Pending" | "Overdue";
  variant: "success" | "warning" | "danger";
  amount: number;
  details: string;
}

const INVOICES: InvoiceItem[] = [
  {
    id: "INV-104",
    status: "Paid",
    variant: "success",
    amount: 240,
    details: "Settled via ACH transfer on March 12.",
  },
  {
    id: "INV-105",
    status: "Pending",
    variant: "warning",
    amount: 180,
    details: "Scheduled for automatic debit on March 28.",
  },
  {
    id: "INV-106",
    status: "Overdue",
    variant: "danger",
    amount: 420,
    details: "Payment reminder sent on March 20.",
  },
];

function SortableAndSelectableTable() {
  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending" | "none"
  >("none");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const sortedInvoices =
    sortDirection === "none"
      ? INVOICES
      : [...INVOICES].sort((a, b) =>
          sortDirection === "ascending"
            ? a.amount - b.amount
            : b.amount - a.amount,
        );

  const allSelected = selectedIds.length === INVOICES.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleSort = () => {
    setSortDirection((prev) =>
      prev === "none"
        ? "ascending"
        : prev === "ascending"
          ? "descending"
          : "none",
    );
  };

  return (
    <Table>
      <Table.Caption>Interactive invoices</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>
            <Checkbox
              aria-label="Select all invoices"
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={(checked) =>
                setSelectedIds(checked ? INVOICES.map((item) => item.id) : [])
              }
            />
          </Table.Head>
          <Table.Head>Details</Table.Head>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head sortDirection={sortDirection} onSort={toggleSort}>
            Amount
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedInvoices.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const isExpanded = expandedIds.includes(item.id);
          return (
            <Fragment key={item.id}>
              <Table.Row selected={isSelected} expanded={isExpanded}>
                <Table.Cell>
                  <Checkbox
                    aria-label={`Select ${item.id}`}
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
                <Table.Cell>
                  <Table.ExpandButton
                    expanded={isExpanded}
                    expandLabel={`Expand ${item.id}`}
                    collapseLabel={`Collapse ${item.id}`}
                    onClick={() =>
                      setExpandedIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id],
                      )
                    }
                  />
                </Table.Cell>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>
                  <Badge variant={item.variant}>{item.status}</Badge>
                </Table.Cell>
                <Table.Cell>${item.amount.toFixed(2)}</Table.Cell>
              </Table.Row>
              <Table.ExpandedRow colSpan={5} open={isExpanded}>
                {item.details}
              </Table.ExpandedRow>
            </Fragment>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export const SortableAndSelectable: Story = {
  render: () => <SortableAndSelectableTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const amountSortButton = canvas.getByRole("button", { name: "Amount" });
    await userEvent.click(amountSortButton);
    await expect(
      canvas.getByRole("columnheader", { name: "Amount" }),
    ).toHaveAttribute("aria-sort", "ascending");

    const firstRowAfterAsc = canvas.getAllByRole("row")[1];
    await expect(firstRowAfterAsc).toHaveTextContent("INV-105");

    await userEvent.click(amountSortButton);
    await expect(
      canvas.getByRole("columnheader", { name: "Amount" }),
    ).toHaveAttribute("aria-sort", "descending");
    const firstRowAfterDesc = canvas.getAllByRole("row")[1];
    await expect(firstRowAfterDesc).toHaveTextContent("INV-106");

    const selectAll = canvas.getByRole("checkbox", {
      name: "Select all invoices",
    });
    const selectFirst = canvas.getByRole("checkbox", {
      name: "Select INV-104",
    });
    await userEvent.click(selectFirst);
    await expect(selectAll).toHaveAttribute("aria-checked", "mixed");
    await expect(selectFirst.closest("tr")).toHaveAttribute("data-selected");

    await userEvent.click(selectAll);
    await expect(selectAll).toHaveAttribute("aria-checked", "true");

    const expandButton = canvas.getByRole("button", { name: "Expand INV-104" });
    await userEvent.click(expandButton);
    await expect(
      canvas.getByText("Settled via ACH transfer on March 12."),
    ).toBeInTheDocument();

    const collapseButton = canvas.getByRole("button", {
      name: "Collapse INV-104",
    });
    await expect(collapseButton).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(collapseButton);
    await expect(
      canvas.queryByText("Settled via ACH transfer on March 12."),
    ).not.toBeInTheDocument();
  },
};

const STICKY_ROWS = Array.from({ length: 16 }, (_, index) => ({
  id: `INV-${201 + index}`,
  customer: `Account ${index + 1}`,
  amount: `$${(120 + index * 35).toFixed(2)}`,
}));

export const StickyHeader: Story = {
  render: () => (
    <div style={{ blockSize: 260 }}>
      <Table stickyHeader>
        <Table.Caption>Scrollable ledger with sticky header</Table.Caption>
        <Table.Header sticky>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Customer</Table.Head>
            <Table.Head>Amount</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {STICKY_ROWS.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.id}</Table.Cell>
              <Table.Cell>{row.customer}</Table.Cell>
              <Table.Cell>{row.amount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ),
};
