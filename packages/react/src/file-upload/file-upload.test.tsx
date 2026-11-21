import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field";
import { FileUpload } from "./file-upload";

describe("FileUpload", () => {
  it("selects files and removes a file from the list", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(
      <Field>
        <Field.Label>Attachments</Field.Label>
        <FileUpload multiple onFilesChange={onFilesChange} />
      </Field>,
    );

    const input = screen.getByLabelText("Attachments") as HTMLInputElement;
    const fileA = new File(["hello"], "report.pdf", {
      type: "application/pdf",
    });
    const fileB = new File(["world"], "notes.txt", { type: "text/plain" });

    await user.upload(input, [fileA, fileB]);
    expect(onFilesChange).toHaveBeenCalledWith([fileA, fileB]);
    expect(screen.getByText("report.pdf")).toBeTruthy();
    expect(screen.getByText("notes.txt")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Remove report.pdf" }));
    expect(onFilesChange).toHaveBeenLastCalledWith([fileB]);
    expect(screen.queryByText("report.pdf")).toBeNull();
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
