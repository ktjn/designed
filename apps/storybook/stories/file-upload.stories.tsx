import { Field, FileUpload } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof FileUpload> = {
  title: "FileUpload",
  component: FileUpload,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: () => (
    <Field>
      <Field.Label>Attachments</Field.Label>
      <FileUpload multiple hint="PDF, PNG, or JPG up to 10 MB" />
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field invalid>
      <Field.Label>Resume</Field.Label>
      <FileUpload accept=".pdf" hint="PDF only" />
      <Field.Error>Please upload a PDF document.</Field.Error>
    </Field>
  ),
};

export const UploadAndRemoveInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Attachments");
    const file = new File(["example"], "summary.pdf", {
      type: "application/pdf",
    });
    await userEvent.upload(input, file);
    await expect(canvas.getByText("summary.pdf")).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove summary.pdf" }),
    );
    await expect(canvas.queryByText("summary.pdf")).not.toBeInTheDocument();
  },
};
