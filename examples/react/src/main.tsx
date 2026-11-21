import "@ktjn/design-tokens/css/all.css";
import {
  Accordion,
  Alert,
  AlertDialog,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  CommandPalette,
  DatePicker,
  Dialog,
  Drawer,
  Field,
  Fieldset,
  Input,
  Link,
  NumberField,
  Pagination,
  Progress,
  RadioGroup,
  Select,
  Separator,
  Slider,
  Spinner,
  Stepper,
  Switch,
  Table,
  Tabs,
  Tag,
  Textarea,
  Toast,
  Toggle,
  ToggleGroup,
  useToast,
} from "@ktjn/design-react";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function WorkspaceDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [brand, setBrand] = useState("default");
  const [colorScheme, setColorScheme] = useState("light");
  const [density, setDensity] = useState("default");
  const [contrast, setContrast] = useState("default");
  const [page, setPage] = useState(1);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [tags, setTags] = useState(["Tokens", "Accessibility", "React"]);
  const toast = useToast();

  useEffect(() => {
    const root = document.documentElement;
    if (brand === "default") {
      root.removeAttribute("data-brand");
    } else {
      root.setAttribute("data-brand", brand);
    }
    root.setAttribute("data-color-scheme", colorScheme);
    if (density === "default") {
      root.removeAttribute("data-density");
    } else {
      root.setAttribute("data-density", density);
    }
    root.setAttribute("data-contrast", contrast);
  }, [brand, colorScheme, density, contrast]);

  return (
    <main
      style={{
        padding: "1.5rem",
        display: "grid",
        gap: "1.25rem",
        maxWidth: "44rem",
        margin: "0 auto",
        background: "var(--ds-color-background-default)",
        color: "var(--ds-color-foreground-default)",
        fontFamily: "var(--ds-font-family-base)",
      }}
    >
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#workspace">Workspace</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Settings</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>

      <Card>
        <Card.Header>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <Avatar alt="Tommy Alander" fallback="TA" />
              <div>
                <Card.Title>Theme & Appearance</Card.Title>
                <Card.Description>
                  Switch brand, color scheme, density, and contrast live.
                </Card.Description>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </Card.Header>
        <Card.Content>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <ToggleGroup
              aria-label="Brand"
              value={[brand]}
              onValueChange={(next) => {
                if (next[0]) setBrand(next[0]);
              }}
            >
              <Toggle value="default">Default</Toggle>
              <Toggle value="editorial">Editorial</Toggle>
            </ToggleGroup>
            <ToggleGroup
              aria-label="Color scheme"
              value={[colorScheme]}
              onValueChange={(next) => {
                if (next[0]) setColorScheme(next[0]);
              }}
            >
              <Toggle value="light">Light</Toggle>
              <Toggle value="dark">Dark</Toggle>
            </ToggleGroup>
            <ToggleGroup
              aria-label="Density"
              value={[density]}
              onValueChange={(next) => {
                if (next[0]) setDensity(next[0]);
              }}
            >
              <Toggle value="default">Default</Toggle>
              <Toggle value="compact">Compact</Toggle>
            </ToggleGroup>
            <ToggleGroup
              aria-label="Contrast"
              value={[contrast]}
              onValueChange={(next) => {
                if (next[0]) setContrast(next[0]);
              }}
            >
              <Toggle value="default">Standard</Toggle>
              <Toggle value="more">More contrast</Toggle>
            </ToggleGroup>
          </div>
        </Card.Content>
      </Card>

      <Alert variant="info" title="Published packages">
        This example imports only the public @ktjn/design-react and
        @ktjn/design-tokens exports.
      </Alert>

      <Progress value={72} label="Workspace storage" showValue />

      <Stepper
        aria-label="Workspace setup"
        currentStep={1}
        steps={[
          { id: "account", label: "Account" },
          { id: "workspace", label: "Workspace" },
          { id: "launch", label: "Launch" },
        ]}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {tags.map((tag) => (
          <Tag
            key={tag}
            variant="info"
            removeLabel={`Remove ${tag}`}
            onRemove={() =>
              setTags((prev) => prev.filter((item) => item !== tag))
            }
          >
            {tag}
          </Tag>
        ))}
      </div>

      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
          <Tabs.Tab value="faq">FAQ</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="profile">
          <form
            style={{ display: "grid", gap: "1rem" }}
            onSubmit={(event) => {
              event.preventDefault();
              const data = new URLSearchParams(
                new FormData(event.currentTarget) as unknown as Record<
                  string,
                  string
                >,
              ).toString();
              setSubmitted(data);
              toast.add({
                title: "Settings saved",
                description: "Your workspace preferences were updated.",
                variant: "success",
              });
            }}
          >
            <Fieldset>
              <Fieldset.Legend>Account</Fieldset.Legend>
              <Field invalid={false}>
                <Field.Label>Email</Field.Label>
                <Input name="email" placeholder="you@example.com" />
                <Field.Description>
                  Used for account notifications.
                </Field.Description>
              </Field>
              <Field>
                <Field.Label>Seats</Field.Label>
                <NumberField name="seats" defaultValue={5} min={1} max={50} />
              </Field>
              <Field>
                <Field.Label>Renewal date</Field.Label>
                <DatePicker name="renewalDate" defaultValue="2026-06-15" />
              </Field>
              <Select
                items={[
                  { value: "basic", label: "Basic" },
                  { value: "pro", label: "Pro" },
                ]}
                defaultValue="pro"
              >
                <Select.Trigger aria-label="Plan">
                  <Select.Value placeholder="Choose a plan" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="basic">Basic</Select.Item>
                  <Select.Item value="pro">Pro</Select.Item>
                </Select.Content>
              </Select>
              <Slider aria-label="Alert threshold" defaultValue={80} />
            </Fieldset>
            <Textarea
              aria-label="Message"
              placeholder="Message"
              name="message"
            />
            {/* biome-ignore lint/a11y/noLabelWithoutControl: Checkbox renders a hidden native <input> nested inside its <span>. */}
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Checkbox name="subscribe" value="yes" />
              Subscribe to updates
            </label>
            <RadioGroup
              name="billing"
              defaultValue="monthly"
              aria-label="Billing"
            >
              <RadioGroup.Item value="monthly">Monthly</RadioGroup.Item>
              <RadioGroup.Item value="annual">Annual</RadioGroup.Item>
            </RadioGroup>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: Switch renders a hidden native <input> nested inside its <span>. */}
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Switch name="digest" />
              Weekly digest
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <Button type="submit" variant="primary" size="medium">
                Save
              </Button>
              <Button variant="secondary" size="small">
                Reset
              </Button>
              <Button variant="primary" loading>
                Syncing
              </Button>
              <Spinner size="small" label="Background sync" />
            </div>
          </form>
          {submitted && <p>Submitted: {submitted}</p>}
        </Tabs.Panel>
        <Tabs.Panel value="invoices">
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <Table>
              <Table.Caption>Billing history</Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Invoice</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Amount</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>INV-104</Table.Cell>
                  <Table.Cell>
                    <Badge variant="success">Paid</Badge>
                  </Table.Cell>
                  <Table.Cell>$240.00</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>INV-105</Table.Cell>
                  <Table.Cell>
                    <Badge variant="warning">Pending</Badge>
                  </Table.Cell>
                  <Table.Cell>$180.00</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Pagination page={page} totalPages={5} onPageChange={setPage} />
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="faq">
          <Accordion>
            <Accordion.Item value="billing">
              <Accordion.Trigger>How does billing work?</Accordion.Trigger>
              <Accordion.Panel>
                You are billed monthly based on your plan.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="cancel">
              <Accordion.Trigger>Can I cancel anytime?</Accordion.Trigger>
              <Accordion.Panel>
                Yes, cancel from account settings at any time.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Tabs.Panel>
      </Tabs>

      <Separator />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <Button variant="secondary" onClick={() => setPaletteOpen(true)}>
          Command palette (Ctrl+K)
        </Button>
        <Drawer side="right">
          <Drawer.Trigger>Open drawer</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Title>Workspace filters</Drawer.Title>
            <Drawer.Description>
              Filter activity by status or date range.
            </Drawer.Description>
            <Drawer.Close>Done</Drawer.Close>
          </Drawer.Content>
        </Drawer>
        <Dialog>
          <Dialog.Trigger>View details</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Details</Dialog.Title>
            <Dialog.Description>
              Extra information about this record.
            </Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog>
        <AlertDialog>
          <AlertDialog.Trigger>Delete account</AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Title>Delete your account?</AlertDialog.Title>
            <AlertDialog.Description>
              This cannot be undone.
            </AlertDialog.Description>
            <AlertDialog.Close>Cancel</AlertDialog.Close>
          </AlertDialog.Content>
        </AlertDialog>
        <Link href="https://example.com">Learn more</Link>
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        enableGlobalShortcut
        items={[
          {
            id: "theme-dark",
            label: "Switch to dark mode",
            group: "Appearance",
          },
          {
            id: "theme-editorial",
            label: "Switch to editorial brand",
            group: "Appearance",
          },
        ]}
        onSelect={(item) => {
          if (item.id === "theme-dark") setColorScheme("dark");
          if (item.id === "theme-editorial") setBrand("editorial");
        }}
      />
    </main>
  );
}

function App() {
  return (
    <Toast.Provider>
      <WorkspaceDemo />
    </Toast.Provider>
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
