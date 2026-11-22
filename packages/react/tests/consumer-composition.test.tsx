import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import {
  AlertDialog,
  Button,
  Calendar,
  Combobox,
  ContextMenu,
  DatePicker,
  Dialog,
  Drawer,
  Field,
  FileUpload,
  Input,
  Link,
  Menu,
  Popover,
  Select,
  Textarea,
  Tooltip,
} from "../src/index.js";

function OverlayFocusPropsHarness() {
  const focusRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={focusRef}>Target</Button>
      <Popover>
        <Popover.Trigger>Popover</Popover.Trigger>
        <Popover.Content initialFocus={focusRef} finalFocus={focusRef}>
          Body
        </Popover.Content>
      </Popover>
      <Menu>
        <Menu.Trigger>Menu</Menu.Trigger>
        <Menu.Content finalFocus={focusRef}>
          <Menu.Item>Edit</Menu.Item>
        </Menu.Content>
      </Menu>
      <ContextMenu>
        <ContextMenu.Trigger>Context area</ContextMenu.Trigger>
        <ContextMenu.Content finalFocus={focusRef}>
          <ContextMenu.Item>Inspect</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
      <Select items={[{ value: "a", label: "A" }]}>
        <Select.Trigger aria-label="Select">
          <Select.Value placeholder="Choose" />
        </Select.Trigger>
        <Select.Content finalFocus={focusRef}>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>
      <Combobox items={[{ value: "a", label: "A" }]}>
        <Combobox.Input />
        <Combobox.Content initialFocus={false} finalFocus={focusRef} />
      </Combobox>
    </>
  );
}

describe("consumer composition and styling escape hatches", () => {
  it("accepts className on root controls and overlay triggers/contents", () => {
    render(
      <Field className="custom-field">
        <Field.Label className="custom-label">Email</Field.Label>
        <Input className="custom-input" />
        <Textarea className="custom-textarea" aria-label="Notes" />
        <Button className="custom-button">Save</Button>
        <Link href="https://example.com" className="custom-link">
          Docs
        </Link>
        <Dialog open>
          <Dialog.Trigger className="custom-dialog-trigger">
            Open dialog
          </Dialog.Trigger>
          <Dialog.Content className="custom-dialog-content">
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Close className="custom-dialog-close">Done</Dialog.Close>
          </Dialog.Content>
        </Dialog>
        <AlertDialog>
          <AlertDialog.Trigger className="custom-alert-trigger">
            Open alert
          </AlertDialog.Trigger>
          <AlertDialog.Content className="custom-alert-content">
            <AlertDialog.Title>Confirm</AlertDialog.Title>
            <AlertDialog.Close className="custom-alert-close">
              Cancel
            </AlertDialog.Close>
          </AlertDialog.Content>
        </AlertDialog>
        <Drawer>
          <Drawer.Trigger className="custom-drawer-trigger">
            Open drawer
          </Drawer.Trigger>
          <Drawer.Content className="custom-drawer-content">
            <Drawer.Title className="custom-drawer-title">Drawer</Drawer.Title>
            <Drawer.Description className="custom-drawer-desc">
              Details
            </Drawer.Description>
            <Drawer.Close className="custom-drawer-close">Close</Drawer.Close>
          </Drawer.Content>
        </Drawer>
        <Menu>
          <Menu.Trigger className="custom-menu-trigger">Menu</Menu.Trigger>
          <Menu.Content className="custom-menu-content">
            <Menu.Item>Edit</Menu.Item>
          </Menu.Content>
        </Menu>
        <Popover>
          <Popover.Trigger className="custom-popover-trigger">
            Popover
          </Popover.Trigger>
          <Popover.Content className="custom-popover-content">
            Body
          </Popover.Content>
        </Popover>
        <Select items={[{ value: "a", label: "A" }]}>
          <Select.Trigger className="custom-select-trigger" aria-label="Select">
            <Select.Value placeholder="Choose" />
          </Select.Trigger>
          <Select.Content className="custom-select-content">
            <Select.Item value="a" className="custom-select-item">
              A
            </Select.Item>
          </Select.Content>
        </Select>
        <Combobox items={[{ value: "a", label: "A" }]}>
          <Combobox.Input className="custom-combobox-input" />
          <Combobox.Content className="custom-combobox-content" />
        </Combobox>
        <Tooltip content="Tip" className="custom-tooltip">
          <Button>Hover</Button>
        </Tooltip>
      </Field>,
    );

    expect(document.querySelector(".custom-field")).not.toBeNull();
    expect(document.querySelector(".custom-input")).not.toBeNull();
    expect(document.querySelector(".custom-textarea")).not.toBeNull();
    expect(document.querySelector(".custom-button")).not.toBeNull();
    expect(document.querySelector(".custom-link")).not.toBeNull();
    expect(document.querySelector(".custom-dialog-trigger")).not.toBeNull();
    expect(document.querySelector(".custom-dialog-content")).not.toBeNull();
  });

  it("supports Swedish localization across Calendar, DatePicker, and FileUpload", () => {
    render(
      <div>
        <Calendar
          locale="sv-SE"
          defaultValue="2026-06-15"
          previousMonthLabel="Föregående månad"
          nextMonthLabel="Nästa månad"
        />
        <Field>
          <Field.Label>Leveransdatum</Field.Label>
          <DatePicker
            locale="sv-SE"
            defaultValue="2026-06-15"
            openCalendarLabel="Välj datum"
          />
        </Field>
        <Field>
          <Field.Label>Dokument</Field.Label>
          <FileUpload
            prompt="Välj filer eller dra och släpp"
            getRemoveLabel={(file) => `Ta bort ${file.name}`}
          />
        </Field>
      </div>,
    );

    expect(
      screen.getByRole("button", { name: "Föregående månad" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Välj datum" })).toBeTruthy();
    expect(screen.getByText("Välj filer eller dra och släpp")).toBeTruthy();
  });

  it("accepts focus management props across overlay popups", () => {
    render(<OverlayFocusPropsHarness />);
    expect(screen.getByRole("button", { name: "Target" })).toBeTruthy();
  });
});
