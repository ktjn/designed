import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { Input } from "../input/input";
import { Field } from "./field";

// Verifies @ktjn/design-react's Input works with an external form-state
// library without any design-system-provided adapter. react-hook-form is a
// devDependency here only, never a production dependency of this package.
function DemoForm({
  onSubmit,
}: {
  onSubmit: (values: { email: string }) => void;
}) {
  const { register, handleSubmit } = useForm<{ email: string }>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <Field.Label>Email</Field.Label>
        <Input {...register("email")} />
      </Field>
      <button type="submit">Submit</button>
    </form>
  );
}

describe("external form library integration", () => {
  it("works with react-hook-form's register() without a design-system adapter", async () => {
    let submitted: { email: string } | undefined;
    render(<DemoForm onSubmit={(values) => (submitted = values)} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
      target: { value: "a@b.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(submitted).toEqual({ email: "a@b.com" });
    });
  });
});
