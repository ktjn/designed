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

export const FormDataSubmissionInteraction: Story = {
  render: () => (
    <form data-testid="file-upload-form">
      <Field>
        <Field.Label>Attachments</Field.Label>
        <FileUpload name="attachments" multiple />
      </Field>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByTestId("file-upload-form") as HTMLFormElement;
    const input = canvas.getByLabelText("Attachments") as HTMLInputElement;
    const fileA = new File(["alpha"], "report.pdf", {
      type: "application/pdf",
    });
    const fileB = new File(["beta"], "notes.txt", { type: "text/plain" });

    const initialDt = new DataTransfer();
    initialDt.items.add(fileA);
    initialDt.items.add(fileB);
    input.files = initialDt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    await expect(await canvas.findByText("report.pdf")).toBeInTheDocument();
    const beforeRemove = new FormData(form)
      .getAll("attachments")
      .map((entry) => (entry as File).name);
    await expect(beforeRemove).toEqual(["report.pdf", "notes.txt"]);

    await userEvent.click(
      canvas.getByRole("button", { name: "Remove report.pdf" }),
    );

    const afterRemove = new FormData(form)
      .getAll("attachments")
      .map((entry) => (entry as File).name);
    await expect(afterRemove).toEqual(["notes.txt"]);

    const dropzone = canvasElement.querySelector(
      '[data-slot="file-upload-dropzone"]',
    ) as HTMLElement;
    const dt = new DataTransfer();
    dt.items.add(
      new File(["gamma"], "invoice.pdf", { type: "application/pdf" }),
    );
    dropzone.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: dt,
      }),
    );

    await expect(await canvas.findByText("invoice.pdf")).toBeInTheDocument();
    const afterDrop = new FormData(form)
      .getAll("attachments")
      .map((entry) => (entry as File).name);
    await expect(afterDrop).toEqual(["notes.txt", "invoice.pdf"]);
  },
};
