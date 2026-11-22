import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Breadcrumb } from "../breadcrumb/breadcrumb";
import { Button } from "../button/button";
import { Tabs } from "../tabs/tabs";
import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  it("renders breadcrumb, title, description, actions, and tabs with data-slot attributes", () => {
    const { container } = render(
      <PageHeader>
        <PageHeader.Breadcrumb>
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#workspace">Workspace</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Billing</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Breadcrumb>
        <PageHeader.Title>Billing</PageHeader.Title>
        <PageHeader.Description>
          Manage invoices and payment methods.
        </PageHeader.Description>
        <PageHeader.Actions>
          <Button variant="secondary">Export</Button>
          <Button variant="primary">Upgrade</Button>
        </PageHeader.Actions>
        <PageHeader.Tabs>
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview">Overview content</Tabs.Panel>
            <Tabs.Panel value="invoices">Invoices content</Tabs.Panel>
          </Tabs>
        </PageHeader.Tabs>
      </PageHeader>,
    );

    const header = container.querySelector('[data-slot="page-header"]');
    expect(header?.tagName).toBe("HEADER");
    expect(
      container.querySelector('[data-slot="page-header-breadcrumb"]'),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("heading", { name: "Billing", level: 1 })
        .getAttribute("data-slot"),
    ).toBe("page-header-title");
    expect(
      screen
        .getByText("Manage invoices and payment methods.")
        .getAttribute("data-slot"),
    ).toBe("page-header-description");
    expect(
      container.querySelector('[data-slot="page-header-actions"]'),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Export" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeTruthy();
    expect(
      container.querySelector('[data-slot="page-header-tabs"]'),
    ).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Overview" })).toBeTruthy();
  });

  it("renders a custom heading level via the as prop", () => {
    render(
      <PageHeader>
        <PageHeader.Title as="h2">Team members</PageHeader.Title>
      </PageHeader>,
    );

    expect(
      screen.getByRole("heading", { name: "Team members", level: 2 }),
    ).toBeTruthy();
  });

  it("forwards ref and className to root and subcomponents", () => {
    const rootRef = createRef<HTMLElement>();
    const breadcrumbRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const actionsRef = createRef<HTMLDivElement>();
    const tabsRef = createRef<HTMLDivElement>();

    render(
      <PageHeader ref={rootRef} className="custom-root">
        <PageHeader.Breadcrumb ref={breadcrumbRef} className="custom-crumb">
          Home
        </PageHeader.Breadcrumb>
        <PageHeader.Title ref={titleRef} className="custom-title">
          Settings
        </PageHeader.Title>
        <PageHeader.Description
          ref={descriptionRef}
          className="custom-description"
        >
          Workspace preferences.
        </PageHeader.Description>
        <PageHeader.Actions ref={actionsRef} className="custom-actions">
          <Button>Save</Button>
        </PageHeader.Actions>
        <PageHeader.Tabs ref={tabsRef} className="custom-tabs">
          Tabs
        </PageHeader.Tabs>
      </PageHeader>,
    );

    expect(rootRef.current?.tagName).toBe("HEADER");
    expect(rootRef.current?.classList.contains("custom-root")).toBe(true);
    expect(breadcrumbRef.current?.classList.contains("custom-crumb")).toBe(
      true,
    );
    expect(titleRef.current?.tagName).toBe("H1");
    expect(titleRef.current?.classList.contains("custom-title")).toBe(true);
    expect(descriptionRef.current?.tagName).toBe("P");
    expect(
      descriptionRef.current?.classList.contains("custom-description"),
    ).toBe(true);
    expect(actionsRef.current?.classList.contains("custom-actions")).toBe(true);
    expect(tabsRef.current?.classList.contains("custom-tabs")).toBe(true);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <PageHeader>
        <PageHeader.Breadcrumb>
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#home">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Analytics</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Breadcrumb>
        <PageHeader.Title>Analytics</PageHeader.Title>
        <PageHeader.Description>
          Monitor traffic and conversion metrics.
        </PageHeader.Description>
        <PageHeader.Actions>
          <Button variant="primary">Create report</Button>
        </PageHeader.Actions>
      </PageHeader>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
