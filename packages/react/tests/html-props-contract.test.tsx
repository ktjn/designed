import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import type {
  AlertDialogCloseProps,
  AlertDialogDescriptionProps,
  AlertDialogTitleProps,
  PopoverCloseProps,
} from "../src/index.js";
import {
  Accordion,
  AlertDialog,
  Autocomplete,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Collapsible,
  Combobox,
  CommandPalette,
  ContextMenu,
  Dialog,
  Drawer,
  Field,
  Fieldset,
  Menu,
  Popover,
  PreviewCard,
  RadioGroup,
  Select,
  Sidebar,
  Switch,
  Table,
  Tabs,
  ToggleGroup,
  Toolbar,
  Tooltip,
} from "../src/index.js";

const srcDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src",
);

const NON_DOM_ROOT_PROPS = new Set([
  "AlertDialogRootProps",
  "ComboboxRootProps",
  "ContextMenuRootProps",
  "DialogRootProps",
  "DrawerRootProps",
  "MenuRootProps",
  "PopoverRootProps",
  "PreviewCardRootProps",
  "SelectRootProps",
  "ToastProviderProps",
  "TooltipProviderProps",
]);

function walkTsxFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkTsxFiles(full));
    } else if (entry.name.endsWith(".tsx") && !entry.name.includes(".test.")) {
      results.push(full);
    }
  }
  return results;
}

describe("HTML attribute, className, ref, and barrel prop-type contracts", () => {
  it("exports every component *Props type from src/index.ts and includes HTML attributes + ref on all DOM-rendering props", () => {
    const indexSrc = readFileSync(path.join(srcDir, "index.ts"), "utf8");
    const files = walkTsxFiles(srcDir).sort();
    const missingFromBarrel: string[] = [];
    const missingHtmlAttributes: string[] = [];
    const missingRef: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const matches = [
        ...source.matchAll(
          /export (?:interface|type) (\w+Props)\b([^;{]*)(?:\{([\s\S]*?)\n\}| = ([\s\S]*?);)/g,
        ),
      ];
      for (const match of matches) {
        const name = match[1] ?? "";
        const header = (match[2] ?? "").replace(/\s+/g, " ");
        const body = match[3] ?? match[4] ?? "";
        if (!new RegExp(`\\b${name}\\b`).test(indexSrc)) {
          missingFromBarrel.push(name);
        }
        if (NON_DOM_ROOT_PROPS.has(name)) {
          continue;
        }
        const extendsHtml =
          /HTMLAttributes|SVGAttributes|ButtonHTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes|AnchorHTMLAttributes|LabelHTMLAttributes|TableHTMLAttributes|ThHTMLAttributes|TdHTMLAttributes|OlHTMLAttributes|LiHTMLAttributes|FieldsetHTMLAttributes|ComponentPropsWithRef|ComponentProps/.test(
            `${header} ${body}`,
          );
        const hasRef =
          /\bref\??:/.test(body) || /ComponentPropsWithRef/.test(header);
        if (!extendsHtml) {
          missingHtmlAttributes.push(name);
        }
        if (!hasRef) {
          missingRef.push(name);
        }
      }
    }

    expect(missingFromBarrel).toEqual([]);
    expect(missingHtmlAttributes).toEqual([]);
    expect(missingRef).toEqual([]);
  });

  it("exports PopoverCloseProps and AlertDialog subcomponent prop types from the barrel", () => {
    const popoverClose: PopoverCloseProps = { className: "p-close" };
    const alertTitle: AlertDialogTitleProps = { className: "a-title" };
    const alertDesc: AlertDialogDescriptionProps = { className: "a-desc" };
    const alertClose: AlertDialogCloseProps = { className: "a-close" };

    expect(popoverClose.className).toBe("p-close");
    expect(alertTitle.className).toBe("a-title");
    expect(alertDesc.className).toBe("a-desc");
    expect(alertClose.className).toBe("a-close");
  });

  it("forwards className, data-testid, style, and ref on Accordion, Tabs, RadioGroup, Select, Combobox, Checkbox, Switch, and Autocomplete", () => {
    const accordionRef = createRef<HTMLDivElement>();
    const accordionItemRef = createRef<HTMLDivElement>();
    const accordionTriggerRef = createRef<HTMLButtonElement>();
    const accordionPanelRef = createRef<HTMLDivElement>();
    const tabsRef = createRef<HTMLDivElement>();
    const tabsListRef = createRef<HTMLDivElement>();
    const tabsTabRef = createRef<HTMLButtonElement>();
    const tabsPanelRef = createRef<HTMLDivElement>();
    const radioGroupRef = createRef<HTMLDivElement>();
    const radioItemRef = createRef<HTMLLabelElement>();
    const selectTriggerRef = createRef<HTMLButtonElement>();
    const selectValueRef = createRef<HTMLSpanElement>();
    const comboboxInputRef = createRef<HTMLInputElement>();
    const autocompleteRef = createRef<HTMLInputElement>();
    const checkboxRef = createRef<HTMLElement>();
    const switchRef = createRef<HTMLElement>();

    render(
      <div>
        <Accordion
          ref={accordionRef}
          defaultValue={["a"]}
          className="acc-root"
          data-testid="acc-root"
        >
          <Accordion.Item
            ref={accordionItemRef}
            value="a"
            className="acc-item"
            data-testid="acc-item"
          >
            <Accordion.Trigger
              ref={accordionTriggerRef}
              className="acc-trigger"
              data-testid="acc-trigger"
            >
              Section A
            </Accordion.Trigger>
            <Accordion.Panel
              ref={accordionPanelRef}
              className="acc-panel"
              data-testid="acc-panel"
            >
              Body A
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Tabs
          ref={tabsRef}
          defaultValue="t1"
          className="tabs-root"
          data-testid="tabs-root"
        >
          <Tabs.List
            ref={tabsListRef}
            className="tabs-list"
            data-testid="tabs-list"
          >
            <Tabs.Tab
              ref={tabsTabRef}
              value="t1"
              className="tabs-tab"
              data-testid="tabs-tab"
            >
              Tab 1
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel
            ref={tabsPanelRef}
            value="t1"
            className="tabs-panel"
            data-testid="tabs-panel"
          >
            Panel 1
          </Tabs.Panel>
        </Tabs>

        <RadioGroup
          ref={radioGroupRef}
          aria-label="Choices"
          className="rg-root"
          data-testid="rg-root"
        >
          <RadioGroup.Item
            ref={radioItemRef}
            value="one"
            className="rg-item"
            data-testid="rg-item"
          >
            One
          </RadioGroup.Item>
        </RadioGroup>

        <Select items={[{ value: "a", label: "Alpha" }]}>
          <Select.Trigger
            ref={selectTriggerRef}
            aria-label="Letter"
            className="sel-trigger"
            data-testid="sel-trigger"
          >
            <Select.Value
              ref={selectValueRef}
              placeholder="Pick"
              className="sel-value"
              data-testid="sel-value"
            />
          </Select.Trigger>
          <Select.Content className="sel-content" data-testid="sel-content">
            <Select.Item value="a" className="sel-item" data-testid="sel-item">
              Alpha
            </Select.Item>
          </Select.Content>
        </Select>

        <Combobox items={[{ value: "a", label: "Alpha" }]}>
          <Combobox.Input
            ref={comboboxInputRef}
            aria-label="Search"
            className="cb-input"
            data-testid="cb-input"
          />
          <Combobox.Content className="cb-content" data-testid="cb-content" />
        </Combobox>

        <Autocomplete
          ref={autocompleteRef}
          items={["Alpha"]}
          aria-label="Suggest"
          className="ac-input"
          data-testid="ac-input"
        />

        <Checkbox
          ref={checkboxRef}
          aria-label="Agree"
          className="chk-root"
          data-testid="chk-root"
          style={{ marginTop: "4px" }}
        />

        <Switch
          ref={switchRef}
          aria-label="Toggle"
          className="sw-root"
          data-testid="sw-root"
          style={{ marginTop: "4px" }}
        />
      </div>,
    );

    expect(screen.getByTestId("acc-root").className).toContain("acc-root");
    expect(accordionRef.current).toBe(screen.getByTestId("acc-root"));
    expect(screen.getByTestId("acc-item").className).toContain("acc-item");
    expect(accordionItemRef.current).toBe(screen.getByTestId("acc-item"));
    expect(screen.getByTestId("acc-trigger").className).toContain(
      "acc-trigger",
    );
    expect(accordionTriggerRef.current).toBe(screen.getByTestId("acc-trigger"));
    expect(screen.getByTestId("acc-panel").className).toContain("acc-panel");
    expect(accordionPanelRef.current).toBe(screen.getByTestId("acc-panel"));

    expect(screen.getByTestId("tabs-root").className).toContain("tabs-root");
    expect(tabsRef.current).toBe(screen.getByTestId("tabs-root"));
    expect(screen.getByTestId("tabs-list").className).toContain("tabs-list");
    expect(tabsListRef.current).toBe(screen.getByTestId("tabs-list"));
    expect(screen.getByTestId("tabs-tab").className).toContain("tabs-tab");
    expect(tabsTabRef.current).toBe(screen.getByTestId("tabs-tab"));
    expect(screen.getByTestId("tabs-panel").className).toContain("tabs-panel");
    expect(tabsPanelRef.current).toBe(screen.getByTestId("tabs-panel"));

    expect(screen.getByTestId("rg-root").className).toContain("rg-root");
    expect(radioGroupRef.current).toBe(screen.getByTestId("rg-root"));
    expect(screen.getByTestId("rg-item").className).toContain("rg-item");
    expect(radioItemRef.current).toBe(screen.getByTestId("rg-item"));

    expect(screen.getByTestId("sel-trigger").className).toContain(
      "sel-trigger",
    );
    expect(selectTriggerRef.current).toBe(screen.getByTestId("sel-trigger"));
    expect(screen.getByTestId("sel-value").className).toContain("sel-value");
    expect(selectValueRef.current).toBe(screen.getByTestId("sel-value"));

    expect(screen.getByTestId("cb-input").className).toContain("cb-input");
    expect(comboboxInputRef.current).toBe(screen.getByTestId("cb-input"));
    expect(autocompleteRef.current).toBe(screen.getByTestId("ac-input"));

    expect(screen.getByTestId("chk-root").style.marginTop).toBe("4px");
    expect(checkboxRef.current).toBe(screen.getByTestId("chk-root"));
    expect(screen.getByTestId("sw-root").style.marginTop).toBe("4px");
    expect(switchRef.current).toBe(screen.getByTestId("sw-root"));
  });

  it("forwards className, data-testid, ref, and events on CommandPalette, Sidebar.Item, and compound components", () => {
    const paletteRef = createRef<HTMLDivElement>();
    const linkItemRef = createRef<HTMLAnchorElement>();
    const buttonItemRef = createRef<HTMLButtonElement>();
    const cardTitleRef = createRef<HTMLHeadingElement>();
    const breadcrumbLinkRef = createRef<HTMLAnchorElement>();
    const tableRowRef = createRef<HTMLTableRowElement>();
    const fieldRef = createRef<HTMLDivElement>();
    const fieldLabelRef = createRef<HTMLLabelElement>();
    const fieldsetRef = createRef<HTMLFieldSetElement>();
    const collapsibleRef = createRef<HTMLDivElement>();
    const toggleGroupRef = createRef<HTMLDivElement>();
    const toolbarRef = createRef<HTMLDivElement>();
    const previewTriggerRef = createRef<HTMLAnchorElement>();
    const tooltipRef = createRef<HTMLDivElement>();
    const dialogTriggerRef = createRef<HTMLButtonElement>();
    const alertTriggerRef = createRef<HTMLButtonElement>();
    const drawerTriggerRef = createRef<HTMLButtonElement>();
    const popoverTriggerRef = createRef<HTMLButtonElement>();
    const menuTriggerRef = createRef<HTMLButtonElement>();
    const contextTriggerRef = createRef<HTMLDivElement>();

    const handleButtonClick = vi.fn();

    render(
      <div>
        <CommandPalette
          ref={paletteRef}
          open
          items={[{ id: "1", label: "Open file" }]}
          className="cp-custom"
          data-testid="cp-custom"
        />

        <Sidebar.Provider>
          <Sidebar>
            <Sidebar.Content>
              <Sidebar.Item
                ref={linkItemRef}
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                data-testid="sb-link"
              >
                External
              </Sidebar.Item>
              <Sidebar.Item
                ref={buttonItemRef}
                disabled={false}
                onClick={(event) => handleButtonClick(event.type)}
                data-testid="sb-button"
              >
                Action
              </Sidebar.Item>
            </Sidebar.Content>
          </Sidebar>
        </Sidebar.Provider>

        <Card>
          <Card.Title ref={cardTitleRef} data-testid="card-title">
            Heading
          </Card.Title>
        </Card>

        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link
                ref={breadcrumbLinkRef}
                href="/"
                data-testid="bc-link"
              >
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        <Table>
          <Table.Body>
            <Table.Row ref={tableRowRef} data-testid="tbl-row">
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <Field ref={fieldRef} data-testid="fld-root">
          <Field.Label ref={fieldLabelRef} data-testid="fld-label">
            Name
          </Field.Label>
        </Field>

        <Fieldset ref={fieldsetRef} data-testid="fs-root">
          <Fieldset.Legend>Legend</Fieldset.Legend>
        </Fieldset>

        <Collapsible ref={collapsibleRef} data-testid="col-root">
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Panel>Content</Collapsible.Panel>
        </Collapsible>

        <ToggleGroup ref={toggleGroupRef} data-testid="tg-root">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup>

        <Toolbar ref={toolbarRef} data-testid="tb-root">
          <Toolbar.Button>Bold</Toolbar.Button>
        </Toolbar>

        <PreviewCard>
          <PreviewCard.Trigger
            ref={previewTriggerRef}
            href="#preview"
            data-testid="pc-trigger"
          >
            Link
          </PreviewCard.Trigger>
          <PreviewCard.Content data-testid="pc-content">
            Card
          </PreviewCard.Content>
        </PreviewCard>

        <Tooltip ref={tooltipRef} content="Info" data-testid="tt-popup">
          <Button>Hover</Button>
        </Tooltip>

        <Dialog>
          <Dialog.Trigger ref={dialogTriggerRef} data-testid="dlg-trigger">
            Open
          </Dialog.Trigger>
          <Dialog.Content>Body</Dialog.Content>
        </Dialog>

        <AlertDialog>
          <AlertDialog.Trigger ref={alertTriggerRef} data-testid="adlg-trigger">
            Alert
          </AlertDialog.Trigger>
          <AlertDialog.Content>Body</AlertDialog.Content>
        </AlertDialog>

        <Drawer>
          <Drawer.Trigger ref={drawerTriggerRef} data-testid="drw-trigger">
            Drawer
          </Drawer.Trigger>
          <Drawer.Content>Body</Drawer.Content>
        </Drawer>

        <Popover>
          <Popover.Trigger ref={popoverTriggerRef} data-testid="pop-trigger">
            Popover
          </Popover.Trigger>
          <Popover.Content>Body</Popover.Content>
        </Popover>

        <Menu>
          <Menu.Trigger ref={menuTriggerRef} data-testid="mnu-trigger">
            Menu
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>One</Menu.Item>
          </Menu.Content>
        </Menu>

        <ContextMenu>
          <ContextMenu.Trigger
            ref={contextTriggerRef}
            data-testid="ctx-trigger"
          >
            Right click
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Inspect</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>,
    );

    expect(screen.getByTestId("cp-custom").className).toContain("cp-custom");
    expect(paletteRef.current).toBe(screen.getByTestId("cp-custom"));

    const sbLink = screen.getByTestId("sb-link");
    expect(sbLink.getAttribute("target")).toBe("_blank");
    expect(sbLink.getAttribute("rel")).toBe("noreferrer");
    expect(linkItemRef.current).toBe(sbLink);

    const sbButton = screen.getByTestId("sb-button");
    fireEvent.click(sbButton);
    expect(handleButtonClick).toHaveBeenCalledWith("click");
    expect(buttonItemRef.current).toBe(sbButton);

    expect(cardTitleRef.current).toBe(screen.getByTestId("card-title"));
    expect(breadcrumbLinkRef.current).toBe(screen.getByTestId("bc-link"));
    expect(tableRowRef.current).toBe(screen.getByTestId("tbl-row"));
    expect(fieldRef.current).toBe(screen.getByTestId("fld-root"));
    expect(fieldLabelRef.current).toBe(screen.getByTestId("fld-label"));
    expect(fieldsetRef.current).toBe(screen.getByTestId("fs-root"));
    expect(collapsibleRef.current).toBe(screen.getByTestId("col-root"));
    expect(toggleGroupRef.current).toBe(screen.getByTestId("tg-root"));
    expect(toolbarRef.current).toBe(screen.getByTestId("tb-root"));
    expect(previewTriggerRef.current).toBe(screen.getByTestId("pc-trigger"));
    expect(dialogTriggerRef.current).toBe(screen.getByTestId("dlg-trigger"));
    expect(alertTriggerRef.current).toBe(screen.getByTestId("adlg-trigger"));
    expect(drawerTriggerRef.current).toBe(screen.getByTestId("drw-trigger"));
    expect(popoverTriggerRef.current).toBe(screen.getByTestId("pop-trigger"));
    expect(menuTriggerRef.current).toBe(screen.getByTestId("mnu-trigger"));
    expect(contextTriggerRef.current).toBe(screen.getByTestId("ctx-trigger"));
  });
});
