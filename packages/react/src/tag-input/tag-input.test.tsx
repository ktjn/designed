import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field.js";
import { TagInput } from "./tag-input.js";

function ControlledHarness() {
  const [tags, setTags] = useState<string[]>(["alpha"]);
  const [text, setText] = useState("");
  return (
    <div>
      <TagInput
        aria-label="Controlled tags"
        value={tags}
        onValueChange={setTags}
        inputValue={text}
        onInputValueChange={setText}
        delimiters={[",", ";"]}
      />
      <output data-testid="state">{`${tags.join("|")}::${text}`}</output>
    </div>
  );
}

describe("TagInput", () => {
  it("supports uncontrolled defaultValue and Enter / delimiter tag creation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TagInput
        aria-label="Tags"
        defaultValue={["react"]}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Tags" });
    expect(screen.getByText("react")).toBeTruthy();

    await user.type(input, "  typescript  {Enter}");
    expect(screen.getByText("typescript")).toBeTruthy();
    expect(input).toHaveProperty("value", "");
    expect(onValueChange).toHaveBeenLastCalledWith(["react", "typescript"]);

    await user.type(input, "css,");
    expect(screen.getByText("css")).toBeTruthy();
    expect(input).toHaveProperty("value", "");
    expect(onValueChange).toHaveBeenLastCalledWith([
      "react",
      "typescript",
      "css",
    ]);
  });

  it("supports controlled value and controlled inputValue", async () => {
    const user = userEvent.setup();

    render(<ControlledHarness />);
    const input = screen.getByRole("textbox", { name: "Controlled tags" });

    await user.type(input, "beta;");
    expect(screen.getByTestId("state").textContent).toBe("alpha|beta::");

    await user.type(input, "gam");
    expect(screen.getByTestId("state").textContent).toBe("alpha|beta::gam");
  });

  it("splits pasted text containing delimiters and adds all valid tags in order", () => {
    const onValueChange = vi.fn();
    render(
      <TagInput
        aria-label="Skills"
        defaultValue={["html"]}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Skills" });
    fireEvent.paste(input, {
      clipboardData: {
        getData: () => " css, js ,  , ts ",
      },
    });

    expect(onValueChange).toHaveBeenCalledWith(["html", "css", "js", "ts"]);
    expect(screen.getByText("css")).toBeTruthy();
    expect(screen.getByText("js")).toBeTruthy();
    expect(screen.getByText("ts")).toBeTruthy();
  });

  it("removes the last tag on Backspace when input is empty", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TagInput
        aria-label="Topics"
        defaultValue={["one", "two"]}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Topics" });
    await user.type(input, "x");
    await user.keyboard("{Backspace}");
    expect(screen.getByText("two")).toBeTruthy();

    await user.keyboard("{Backspace}");
    expect(screen.queryByText("two")).toBeNull();
    expect(onValueChange).toHaveBeenLastCalledWith(["one"]);
  });

  it("removes specific tag on button click and returns focus to input", async () => {
    const user = userEvent.setup();
    render(
      <TagInput
        aria-label="Labels"
        defaultValue={["first", "second", "third"]}
        getRemoveLabel={(tag) => `Delete ${tag}`}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Labels" });
    await user.click(screen.getByRole("button", { name: "Delete second" }));

    expect(screen.queryByText("second")).toBeNull();
    expect(screen.getByText("first")).toBeTruthy();
    expect(screen.getByText("third")).toBeTruthy();
    expect(document.activeElement).toBe(input);
  });

  it("focuses the input when clicking the wrapper", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TagInput aria-label="Keywords" defaultValue={["design"]} />,
    );

    const wrapper = container.querySelector(
      '[data-slot="tag-input"]',
    ) as HTMLElement;
    const input = screen.getByRole("textbox", { name: "Keywords" });

    await user.click(wrapper);
    expect(document.activeElement).toBe(input);
  });

  it("rejects duplicates, invalid tags, and excess tags via onReject", async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();

    render(
      <TagInput
        aria-label="Emails"
        defaultValue={["a@b.com"]}
        maxTags={2}
        validate={(tag) => tag.includes("@")}
        onReject={onReject}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Emails" });

    await user.type(input, "a@b.com{Enter}");
    expect(onReject).toHaveBeenLastCalledWith("a@b.com", "duplicate");

    await user.clear(input);
    await user.type(input, "not-an-email{Enter}");
    expect(onReject).toHaveBeenLastCalledWith("not-an-email", "invalid");

    await user.clear(input);
    await user.type(input, "c@d.com{Enter}");
    expect(screen.getByText("c@d.com")).toBeTruthy();

    await user.type(input, "e@f.com{Enter}");
    expect(onReject).toHaveBeenLastCalledWith("e@f.com", "max");
    expect(screen.queryByText("e@f.com")).toBeNull();
  });

  it("allows duplicate tags when allowDuplicates is true and removes only the clicked copy", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TagInput
        aria-label="Repeatable"
        defaultValue={["dup"]}
        allowDuplicates
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Repeatable" });
    await user.type(input, "dup{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["dup", "dup"]);

    const removeButtons = screen.getAllByRole("button", { name: "Remove dup" });
    expect(removeButtons).toHaveLength(2);

    await user.click(removeButtons[0] as HTMLElement);
    expect(onValueChange).toHaveBeenLastCalledWith(["dup"]);
    expect(screen.getAllByRole("button", { name: "Remove dup" })).toHaveLength(
      1,
    );
  });

  it("filters suggestions and supports ArrowDown, ArrowUp, Enter, Escape, and aria-activedescendant", async () => {
    const user = userEvent.setup();

    render(
      <TagInput
        aria-label="Languages"
        defaultValue={["Go"]}
        suggestions={["TypeScript", "JavaScript", "Rust", "Go"]}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Languages" });
    await user.click(input);

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeTruthy();
    expect(screen.queryByRole("option", { name: "Go" })).toBeNull();
    expect(screen.getAllByRole("option")).toHaveLength(3);

    await user.type(input, "Script");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);

    await user.keyboard("{ArrowDown}");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0]?.id);
    expect(options[0]?.getAttribute("aria-selected")).toBe("true");

    await user.keyboard("{ArrowDown}");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[1]?.id);

    await user.keyboard("{ArrowUp}");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0]?.id);

    await user.keyboard("{Enter}");
    expect(screen.getByText("TypeScript")).toBeTruthy();
    expect(input).toHaveProperty("value", "");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("integrates with Field for label, description, error, disabled, and invalid", () => {
    render(
      <Field invalid disabled>
        <Field.Label>Recipients</Field.Label>
        <TagInput defaultValue={["team@example.com"]} />
        <Field.Description>Separate with commas.</Field.Description>
        <Field.Error>At least two recipients required.</Field.Error>
      </Field>,
    );

    const input = screen.getByRole("textbox", {
      name: "Recipients",
    }) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("aria-invalid")).toBe("true");

    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain(screen.getByText("Separate with commas.").id);
    expect(describedBy).toContain(
      screen.getByText("At least two recipients required.").id,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("prevents editing and hides remove buttons when readOnly", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TagInput
        aria-label="Locked tags"
        defaultValue={["pinned"]}
        readOnly
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", {
      name: "Locked tags",
    }) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(screen.queryByRole("button")).toBeNull();

    input.focus();
    await user.keyboard("{Backspace}");
    expect(screen.getByText("pinned")).toBeTruthy();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("forwards ref to the inner input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TagInput ref={ref} aria-label="Tags" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("has no axe violations inside Field and with open suggestions", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Field>
        <Field.Label>Frameworks</Field.Label>
        <TagInput
          defaultValue={["React"]}
          suggestions={["React", "Vue", "Svelte"]}
        />
        <Field.Description>
          Type to filter or add custom tags.
        </Field.Description>
      </Field>,
    );

    expect(await axe(container)).toHaveNoViolations();

    const input = screen.getByRole("combobox", { name: "Frameworks" });
    await user.click(input);
    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(await axe(container)).toHaveNoViolations();
  });
});
