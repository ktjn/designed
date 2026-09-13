import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "../checkbox/checkbox";
import { Input } from "../input/input";
import { Field } from "./field";

describe("native form submission", () => {
  it("submits Input and Checkbox values via native FormData, without any design-system form adapter", () => {
    let submittedData: FormData | undefined;
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submittedData = new FormData(event.currentTarget);
        }}
      >
        <Field>
          <Field.Label>Email</Field.Label>
          <Input name="email" defaultValue="a@b.com" />
        </Field>
        <Checkbox
          name="subscribe"
          value="yes"
          defaultChecked
          aria-label="Subscribe"
        />
        <button type="submit">Submit</button>
      </form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(submittedData).toBeDefined();
    expect(submittedData?.get("email")).toBe("a@b.com");
    expect(submittedData?.get("subscribe")).toBe("yes");
  });
});
