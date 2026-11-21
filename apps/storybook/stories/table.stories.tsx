import { Badge, Table } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
