import { CalendarIcon, InfoIcon, SearchIcon } from "@ktjn/design-icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  DatePicker,
  Field,
  Grid,
  Input,
  InputGroup,
  Kbd,
  Link,
  Meter,
  Separator,
  Sidebar,
  Stack,
  Switch,
  Table,
  Tag,
} from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Blocks",
};

export default meta;
type Story = StoryObj;

export const LoginForm: Story = {
  render: () => (
    <Container size="sm">
      <Card>
        <Card.Header>
          <Card.Title>Sign in</Card.Title>
          <Card.Description>
            Enter your credentials to access your workspace.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Stack gap="md">
            <Field>
              <Field.Label>Email</Field.Label>
              <Input type="email" placeholder="you@example.com" />
            </Field>
            <Field>
              <Field.Label>Password</Field.Label>
              <Input type="password" placeholder="••••••••" />
            </Field>
            <Stack direction="horizontal" align="center" justify="between" wrap>
              {/* biome-ignore lint/a11y/noLabelWithoutControl: Checkbox renders a hidden native input */}
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--ds-font-family-base)",
                  fontSize: "var(--ds-font-size-100)",
                }}
              >
                <Checkbox />
                Remember me
              </label>
              <Link href="#reset">Forgot password?</Link>
            </Stack>
          </Stack>
        </Card.Content>
        <Card.Footer>
          <Button variant="primary">Sign in</Button>
        </Card.Footer>
      </Card>
    </Container>
  ),
};

export const SettingsPage: Story = {
  render: () => (
    <Container size="md">
      <Stack gap="lg">
        <Stack direction="horizontal" align="center" justify="between" wrap>
          <Stack direction="horizontal" align="center" gap="md">
            <Avatar alt="Alex Kim" fallback="AK" />
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "var(--ds-font-size-300)",
                  fontFamily: "var(--ds-font-family-base)",
                }}
              >
                Workspace Settings
              </h1>
              <span
                style={{
                  fontSize: "var(--ds-font-size-100)",
                  color: "var(--ds-color-foreground-muted)",
                  fontFamily: "var(--ds-font-family-base)",
                }}
              >
                Manage domain, billing schedule, and notifications.
              </span>
            </div>
          </Stack>
          <Badge variant="success">Pro plan</Badge>
        </Stack>

        <h2
          style={{
            margin: 0,
            fontSize: "var(--ds-font-size-200)",
            fontFamily: "var(--ds-font-family-base)",
          }}
        >
          General
        </h2>

        <Card>
          <Card.Header>
            <Card.Title>Organization details</Card.Title>
            <Card.Description>
              Displayed on invoices and public status pages.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Grid columns={2} gap="md">
              <Field>
                <Field.Label>Workspace URL</Field.Label>
                <InputGroup>
                  <InputGroup.Addon>https://</InputGroup.Addon>
                  <InputGroup.Input defaultValue="acme" />
                  <InputGroup.Addon align="end">.app</InputGroup.Addon>
                </InputGroup>
              </Field>
              <Field>
                <Field.Label>Renewal date</Field.Label>
                <DatePicker defaultValue="2026-09-01" />
              </Field>
            </Grid>
          </Card.Content>
          <Card.Footer>
            <Button variant="ghost">Discard</Button>
            <Button variant="primary">Save changes</Button>
          </Card.Footer>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Notifications</Card.Title>
          </Card.Header>
          <Card.Content>
            <Stack gap="md">
              {/* biome-ignore lint/a11y/noLabelWithoutControl: Switch renders a hidden native input */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--ds-font-family-base)",
                  fontSize: "var(--ds-font-size-100)",
                }}
              >
                <span>Weekly usage digest</span>
                <Switch defaultChecked />
              </label>
              <Separator />
              <Meter value={68} label="Monthly API quota" showValue />
            </Stack>
          </Card.Content>
        </Card>
      </Stack>
    </Container>
  ),
};

export const DashboardShell: Story = {
  render: () => (
    <div style={{ border: "1px solid var(--ds-color-border-default)" }}>
      <Sidebar.Provider defaultOpen>
        <Sidebar aria-label="Dashboard navigation">
          <Sidebar.Header>Design Ops</Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Overview</Sidebar.GroupLabel>
              <Sidebar.Item
                href="#metrics"
                active
                icon={<InfoIcon aria-hidden />}
              >
                Metrics
              </Sidebar.Item>
              <Sidebar.Item
                href="#releases"
                icon={<CalendarIcon aria-hidden />}
              >
                Releases
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>v0.3.0</Sidebar.Footer>
        </Sidebar>
        <Sidebar.Inset>
          <div style={{ padding: "1.25rem" }}>
            <Stack gap="lg">
              <Stack
                direction="horizontal"
                align="center"
                justify="between"
                gap="md"
                wrap
              >
                <Stack direction="horizontal" align="center" gap="md">
                  <Sidebar.Trigger />
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "var(--ds-font-size-200)",
                      fontFamily: "var(--ds-font-family-base)",
                    }}
                  >
                    Component Health
                  </h1>
                </Stack>
                <div style={{ inlineSize: "16rem" }}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <SearchIcon aria-hidden />
                    </InputGroup.Addon>
                    <InputGroup.Input
                      aria-label="Filter components"
                      placeholder="Filter..."
                    />
                    <InputGroup.Addon align="end">
                      <Kbd size="sm">⌘K</Kbd>
                    </InputGroup.Addon>
                  </InputGroup>
                </div>
              </Stack>

              <h2
                style={{
                  margin: 0,
                  fontSize: "var(--ds-font-size-100)",
                  fontFamily: "var(--ds-font-family-base)",
                  color: "var(--ds-color-foreground-muted)",
                }}
              >
                Key metrics
              </h2>

              <Grid columns={3} gap="md">
                <Card>
                  <Card.Header>
                    <Card.Title>59</Card.Title>
                    <Card.Description>Published components</Card.Description>
                  </Card.Header>
                </Card>
                <Card>
                  <Card.Header>
                    <Card.Title>100%</Card.Title>
                    <Card.Description>WCAG AA & axe pass rate</Card.Description>
                  </Card.Header>
                </Card>
                <Card>
                  <Card.Header>
                    <Card.Title>853 B</Card.Title>
                    <Card.Description>Single Button import</Card.Description>
                  </Card.Header>
                </Card>
              </Grid>

              <Stack direction="horizontal" gap="sm" wrap>
                <Tag variant="info">Base UI 1.9</Tag>
                <Tag variant="success">TypeScript 7</Tag>
                <Tag variant="neutral">Forced Colors</Tag>
              </Stack>

              <Table>
                <Table.Caption>Recent package releases</Table.Caption>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Package</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Exports</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>@ktjn/design-tokens</Table.Cell>
                    <Table.Cell>
                      <Badge variant="success">Published</Badge>
                    </Table.Cell>
                    <Table.Cell>CSS, JSON, TS</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>@ktjn/design-react</Table.Cell>
                    <Table.Cell>
                      <Badge variant="success">Published</Badge>
                    </Table.Cell>
                    <Table.Cell>59 components</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Stack>
          </div>
        </Sidebar.Inset>
      </Sidebar.Provider>
    </div>
  ),
};
