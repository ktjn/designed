import { Pagination } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Pagination> = {
  title: "Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function ControlledPagination() {
  const [page, setPage] = useState(2);
  return <Pagination page={page} totalPages={10} onPageChange={setPage} />;
}

export const Default: Story = {
  render: () => <ControlledPagination />,
};

export const NavigationInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(canvas.getByRole("button", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};
