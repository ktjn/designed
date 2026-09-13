import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Input } from "../input/input";
import { Field } from "./field";

describe("Field", () => {
  it("associates the label with the control via generated ids", () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Input name="email" />
      </Field>,
    );
    const input = screen.getByRole("textbox", {
      name: "Email",
    }) as HTMLInputElement;
    expect(input.id).toBeTruthy();
  });

  it("associates the description and error with the control via aria-describedby", () => {
    render(
      <Field invalid>
        <Field.Label>Email</Field.Label>
        <Input name="email" />
        <Field.Description>Used for account notifications.</Field.Description>
        <Field.Error>Required</Field.Error>
      </Field>,
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    const description = screen.getByText("Used for account notifications.");
    const error = screen.getByText("Required");
    expect(describedBy).toContain(description.id);
    expect(describedBy).toContain(error.id);
  });

  it("marks the control invalid via aria-invalid when the field is invalid", () => {
    render(
      <Field invalid>
        <Field.Label>Email</Field.Label>
        <Input name="email" />
      </Field>,
    );
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("does not render Field.Error when there is no error", () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Input name="email" />
        <Field.Error>{undefined}</Field.Error>
      </Field>,
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("lets an explicit id override the generated one", () => {
    render(
      <Field>
        <Input name="email" id="custom-id" />
      </Field>,
    );
    expect(screen.getByRole("textbox").id).toBe("custom-id");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Field invalid>
        <Field.Label>Email</Field.Label>
        <Input name="email" />
        <Field.Description>Used for account notifications.</Field.Description>
        <Field.Error>Required</Field.Error>
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
