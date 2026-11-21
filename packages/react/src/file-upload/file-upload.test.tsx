import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field";
import { FileUpload } from "./file-upload";

describe("FileUpload", () => {
  it("selects files, removes one, and syncs remaining files via DataTransfer", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const syncedBatches: string[][] = [];
    const originalDataTransfer = globalThis.DataTransfer;

    class MockDataTransfer {
      private list: File[] = [];
      items = {
        add: (file: File) => {
          this.list.push(file);
        },
      };
      get files() {
        syncedBatches.push(this.list.map((f) => f.name));
        return this.list as unknown as FileList;
      }
    }

    globalThis.DataTransfer =
      MockDataTransfer as unknown as typeof DataTransfer;
    const filesSetter = vi
      .spyOn(HTMLInputElement.prototype, "files", "set")
      .mockImplementation(() => {});

    try {
      render(
        <Field>
          <Field.Label>Attachments</Field.Label>
          <FileUpload
            name="attachments"
            multiple
            onFilesChange={onFilesChange}
          />
        </Field>,
      );

      const input = screen.getByLabelText("Attachments") as HTMLInputElement;
      const fileA = new File(["hello"], "report.pdf", {
        type: "application/pdf",
      });
      const fileB = new File(["world"], "notes.txt", { type: "text/plain" });

      fireEvent.change(input, { target: { files: [fileA, fileB] } });
      expect(onFilesChange).toHaveBeenCalledWith([fileA, fileB]);
      expect(screen.getByText("report.pdf")).toBeTruthy();
      expect(screen.getByText("notes.txt")).toBeTruthy();

      await user.click(
        screen.getByRole("button", { name: "Remove report.pdf" }),
      );
      expect(onFilesChange).toHaveBeenLastCalledWith([fileB]);
      expect(screen.queryByText("report.pdf")).toBeNull();
      expect(syncedBatches.at(-1)).toEqual(["notes.txt"]);

      const dropzone = screen
        .getByText("Choose files or drag and drop")
        .closest('[data-slot="file-upload-dropzone"]') as HTMLElement;
      const fileC = new File(["dropped"], "invoice.pdf", {
        type: "application/pdf",
      });
      fireEvent.drop(dropzone, { dataTransfer: { files: [fileC] } });
      expect(onFilesChange).toHaveBeenLastCalledWith([fileB, fileC]);
      expect(syncedBatches.at(-1)).toEqual(["notes.txt", "invoice.pdf"]);
    } finally {
      filesSetter.mockRestore();
      globalThis.DataTransfer = originalDataTransfer;
    }
  });

  it("supports localized remove labels via getRemoveLabel and inherits Field disabled", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Field>
        <Field.Label>Bilagor</Field.Label>
        <FileUpload
          prompt="Välj filer eller dra och släpp"
          getRemoveLabel={(file) => `Ta bort ${file.name}`}
        />
      </Field>,
    );

    const input = screen.getByLabelText("Bilagor") as HTMLInputElement;
    const file = new File(["hej"], "kvitto.pdf", { type: "application/pdf" });
    await user.upload(input, file);
    expect(
      screen.getByRole("button", { name: "Ta bort kvitto.pdf" }),
    ).toBeTruthy();

    rerender(
      <Field disabled>
        <Field.Label>Bilagor</Field.Label>
        <FileUpload
          prompt="Välj filer eller dra och släpp"
          getRemoveLabel={(f) => `Ta bort ${f.name}`}
        />
      </Field>,
    );
    expect(
      (screen.getByLabelText("Bilagor") as HTMLInputElement).disabled,
    ).toBe(true);
  });

  it("reflects invalid state from Field context", () => {
    render(
      <Field invalid>
        <Field.Label>Resume</Field.Label>
        <FileUpload accept=".pdf" />
        <Field.Error>Upload a PDF file.</Field.Error>
      </Field>,
    );
    const input = screen.getByLabelText("Resume");
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Field>
        <Field.Label>Documents</Field.Label>
        <FileUpload />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
