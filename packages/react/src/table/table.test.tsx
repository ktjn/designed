import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Table } from "./table";

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
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Table>
        <Table.Caption>Members</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Role</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Alex</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
