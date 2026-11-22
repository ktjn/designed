import { fireEvent, render, screen } from "@testing-library/react";
import { type ComponentPropsWithRef, createRef, useRef } from "react";
import { describe, expect, it } from "vitest";
import {
  Accordion,
  AlertDialog,
  Breadcrumb,
  Button,
  Calendar,
  Collapsible,
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
  PreviewCard,
  Select,
  Sidebar,
  Tabs,
  Textarea,
  Toggle,
  Toolbar,
  Tooltip,
} from "../src/index.js";

function RouterLink({
  to,
  ...props
}: Omit<ComponentPropsWithRef<"a">, "href"> & { to: string }) {
  return <a href={to} {...props} />;
}

it("composes navigation styles, props and refs onto router links", () => {
  const ref = createRef<HTMLAnchorElement>();
  const renderRef = createRef<HTMLAnchorElement>();
  render(
    <>
      <Link
        ref={ref}
        className="outer"
        render={<RouterLink ref={renderRef} to="/docs" className="router" />}
      >
        Docs
      </Link>
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link render={<RouterLink to="/docs/usage" />}>
              Usage
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
      <Sidebar.Item active render={<RouterLink to="/home" />}>
        Home
      </Sidebar.Item>
    </>,
  );
  const docs = screen.getByRole("link", { name: "Docs" });
  expect(docs).toBe(ref.current);
  expect(docs).toBe(renderRef.current);
  expect(docs.className.split(" ")).toEqual(
    expect.arrayContaining(["outer", "router"]),
  );
  expect(docs.getAttribute("data-slot")).toBe("link");
  expect(screen.getByRole("link", { name: "Usage" }).getAttribute("href")).toBe(
    "/docs/usage",
  );
  const home = screen.getByRole("link", { name: "Home" });
  expect(home.getAttribute("href")).toBe("/home");
  expect(home.getAttribute("aria-current")).toBe("page");
  expect(home.hasAttribute("type")).toBe(false);
});

it("renders replacement elements for Base UI components and keeps their interactions", () => {
  render(
    <>
      <ContextMenu>
        <ContextMenu.Trigger render={<section />}>Context</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item render={<a href="/context" />}>
            Inspect
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
      <PreviewCard>
        <PreviewCard.Trigger render={<RouterLink to="/preview" />}>
          Preview
        </PreviewCard.Trigger>
      </PreviewCard>
      <Menu defaultOpen>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Item nativeButton render={<button type="button" />}>
            Edit
          </Menu.Item>
        </Menu.Content>
      </Menu>
      <Toolbar>
        <Toolbar.Button nativeButton={false} render={<span />}>
          Format
        </Toolbar.Button>
        <Toolbar.Link render={<RouterLink to="/help" />}>Help</Toolbar.Link>
      </Toolbar>
      <Collapsible>
        <Collapsible.Trigger nativeButton={false} render={<span />}>
          Details
        </Collapsible.Trigger>
        <Collapsible.Panel>More information</Collapsible.Panel>
      </Collapsible>
      <Accordion>
        <Accordion.Item value="a">
          <Accordion.Trigger nativeButton={false} render={<span />}>
            Accordion
          </Accordion.Trigger>
        </Accordion.Item>
      </Accordion>
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a" nativeButton={false} render={<span />}>
            First
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Select>
        <Select.Trigger nativeButton={false} render={<span />}>
          Select
        </Select.Trigger>
      </Select>
      <Toggle nativeButton={false} render={<span />}>
        Bold
      </Toggle>
    </>,
  );
  const slots = [
    ["context-menu-trigger", "SECTION"],
    ["preview-card-trigger", "A"],
    ["menu-item", "BUTTON"],
    ["toolbar-button", "SPAN"],
    ["toolbar-link", "A"],
    ["collapsible-trigger", "SPAN"],
    ["accordion-trigger", "SPAN"],
    ["tabs-tab", "SPAN"],
    ["select-trigger", "SPAN"],
    ["toggle", "SPAN"],
  ];
  for (const [slot, tag] of slots) {
    expect(document.querySelector(`[data-slot="${slot}"]`)?.tagName).toBe(tag);
  }
  fireEvent.contextMenu(screen.getByText("Context"));
  expect(
    document.querySelector('[data-slot="context-menu-item"]')?.tagName,
  ).toBe("A");
  const details = screen
    .getByText("Details")
    .closest('[data-slot="collapsible-trigger"]');
  expect(details?.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(screen.getByText("Details"));
  expect(details?.getAttribute("aria-expanded")).toBe("true");
  const bold = screen.getByText("Bold");
  fireEvent.click(bold);
  expect(bold.getAttribute("aria-pressed")).toBe("true");
});

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
