import { ContextualHelp, Link } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectEventuallyRemoved } from "./utils/expect-removed";

const meta: Meta<typeof ContextualHelp> = {
  title: "ContextualHelp",
  component: ContextualHelp,
};

export default meta;
type Story = StoryObj<typeof ContextualHelp>;

export const Default: Story = {
  render: () => (
    <ContextualHelp heading="API rate limits">
      Standard workspaces include up to 1,000 requests per minute per token.
    </ContextualHelp>
  ),
};

export const HelpVariant: Story = {
  render: () => (
    <ContextualHelp
      variant="help"
      heading="Need help with permissions?"
      footer={<Link href="#permissions-guide">Read permissions guide</Link>}
    >
      Workspace owners can assign editor or viewer roles for each project.
    </ContextualHelp>
  ),
};

export const OpenAndDismissInteraction: Story = {
  ...HelpVariant,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole("button", { name: "Help" });

    await userEvent.click(trigger);
    const dialog = await body.findByRole("dialog");
    await expect(dialog).toHaveAttribute(
      "data-slot",
      "contextual-help-content",
    );
    await expect(
      within(dialog).getByText("Need help with permissions?"),
    ).toBeVisible();
    await expect(
      within(dialog).getByText(
        "Workspace owners can assign editor or viewer roles for each project.",
      ),
    ).toBeVisible();
    await expect(
      within(dialog).getByRole("link", { name: "Read permissions guide" }),
    ).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await expectEventuallyRemoved(() => body.queryByRole("dialog"));
    await expect(trigger).toHaveFocus();
  },
};
