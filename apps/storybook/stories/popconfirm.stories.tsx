import { Button, Popconfirm } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { expectEventuallyRemoved } from "./utils/expect-removed";

const meta: Meta<typeof Popconfirm> = {
  title: "Popconfirm",
  component: Popconfirm,
};

export default meta;
type Story = StoryObj<typeof Popconfirm>;

export const Default: Story = {
  render: () => (
    <Popconfirm
      title="Publish changes?"
      description="Updates will be visible to all workspace members."
      confirmLabel="Publish"
    >
      <Button>Publish</Button>
    </Popconfirm>
  ),
};

export const DangerConfirm: Story = {
  render: () => (
    <Popconfirm
      title="Delete project?"
      description="This action permanently removes all project data."
      confirmLabel="Delete"
      confirmVariant="danger"
    >
      <Button variant="danger">Delete project</Button>
    </Popconfirm>
  ),
};

function ConfirmAndCancelDemo() {
  const [status, setStatus] = useState("Idle");

  return (
    <div style={{ display: "grid", gap: "var(--ds-space-stack-md)" }}>
      <div>
        <Popconfirm
          title="Delete record?"
          description="This record cannot be restored."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="danger"
          onCancel={() => setStatus("Canceled")}
          onConfirm={async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setStatus("Confirmed");
          }}
        >
          <Button variant="danger">Delete record</Button>
        </Popconfirm>
      </div>
      <p role="status">{status}</p>
    </div>
  );
}

export const ConfirmAndCancelInteraction: Story = {
  render: () => <ConfirmAndCancelDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole("button", { name: "Delete record" });

    await userEvent.click(trigger);
    let dialog = await body.findByRole("dialog");
    await expect(dialog).toHaveAttribute("data-slot", "popconfirm-content");
    await expect(within(dialog).getByText("Delete record?")).toBeVisible();
    await expect(
      within(dialog).getByText("This record cannot be restored."),
    ).toBeVisible();

    await userEvent.click(
      within(dialog).getByRole("button", { name: "Cancel" }),
    );
    await expectEventuallyRemoved(() => body.queryByRole("dialog"));
    await expect(canvas.getByRole("status")).toHaveTextContent("Canceled");

    await userEvent.click(trigger);
    dialog = await body.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await expectEventuallyRemoved(() => body.queryByRole("dialog"));
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    dialog = await body.findByRole("dialog");
    const cancelButton = within(dialog).getByRole("button", { name: "Cancel" });
    const confirmButton = within(dialog).getByRole("button", {
      name: "Delete",
    });

    await userEvent.click(confirmButton);
    await expect(confirmButton).toHaveAttribute("data-loading", "");
    await expect(confirmButton).toHaveAttribute("aria-busy", "true");
    await expect(cancelButton).toBeDisabled();

    await userEvent.keyboard("{Escape}");
    await expect(body.getByRole("dialog")).toBeInTheDocument();

    await expectEventuallyRemoved(() => body.queryByRole("dialog"));
    await expect(canvas.getByRole("status")).toHaveTextContent("Confirmed");
  },
};
