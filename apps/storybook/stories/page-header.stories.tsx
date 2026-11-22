import { Breadcrumb, Button, PageHeader, Tabs } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof PageHeader> = {
  title: "PageHeader",
  component: PageHeader,
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.Title>Billing</PageHeader.Title>
      <PageHeader.Description>
        Manage invoices, payment methods, and workspace subscription plans.
      </PageHeader.Description>
      <PageHeader.Actions>
        <Button variant="secondary">Export</Button>
        <Button variant="primary">Upgrade plan</Button>
      </PageHeader.Actions>
    </PageHeader>
  ),
};

export const WithBreadcrumbAndTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <PageHeader>
        <PageHeader.Breadcrumb>
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#workspace">Workspace</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#settings">Settings</Breadcrumb.Link>
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
          Manage invoices, payment methods, and workspace subscription plans.
        </PageHeader.Description>
        <PageHeader.Actions>
          <Button variant="secondary">Download invoices</Button>
          <Button variant="primary">Add payment method</Button>
        </PageHeader.Actions>
        <PageHeader.Tabs>
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
            <Tabs.Tab value="usage">Usage</Tabs.Tab>
          </Tabs.List>
        </PageHeader.Tabs>
      </PageHeader>
      <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
      <Tabs.Panel value="invoices">Invoices panel</Tabs.Panel>
      <Tabs.Panel value="usage">Usage panel</Tabs.Panel>
    </Tabs>
  ),
};
