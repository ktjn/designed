import "@ktjn/design-tokens/css/base.css";
import "@ktjn/design-tokens/css/schemes/dark.css";
import "@ktjn/design-tokens/css/densities/compact.css";
import "@ktjn/design-tokens/css/contrasts/more.css";
import {
  Accordion,
  AlertDialog,
  Button,
  Checkbox,
  Dialog,
  Field,
  Input,
  Link,
  RadioGroup,
  Select,
  Switch,
  Tabs,
  Textarea,
} from "@ktjn/design-react";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <main
      style={{
        padding: "1rem",
        display: "grid",
        gap: "1rem",
        maxWidth: "24rem",
      }}
    >
      <p>
        This example only imports the published @ktjn/design-react and
        @ktjn/design-tokens package exports.
      </p>
      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="faq">FAQ</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="profile">
          <Select
            items={[
              { value: "basic", label: "Basic" },
              { value: "pro", label: "Pro" },
            ]}
            defaultValue="basic"
          >
            <Select.Trigger aria-label="Plan">
              <Select.Value placeholder="Choose a plan" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="basic">Basic</Select.Item>
              <Select.Item value="pro">Pro</Select.Item>
            </Select.Content>
          </Select>
        </Tabs.Panel>
        <Tabs.Panel value="faq">
          <Accordion>
            <Accordion.Item value="billing">
              <Accordion.Trigger>How does billing work?</Accordion.Trigger>
              <Accordion.Panel>
                You're billed monthly based on your plan.
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
      <form
        style={{ display: "grid", gap: "1rem" }}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(
            new URLSearchParams(
              new FormData(event.currentTarget) as unknown as Record<
                string,
                string
              >,
            ).toString(),
          );
        }}
      >
        <Field invalid={false}>
          <Field.Label>Email</Field.Label>
          <Input name="email" placeholder="Email" />
          <Field.Description>Used for account notifications.</Field.Description>
        </Field>
        <Textarea aria-label="Message" placeholder="Message" name="message" />
        {/* biome-ignore lint/a11y/noLabelWithoutControl: Checkbox renders a hidden native <input> nested inside its <span>. */}
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Checkbox name="subscribe" value="yes" />
          Subscribe to updates
        </label>
        <RadioGroup name="plan" defaultValue="basic" aria-label="Plan">
          <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
          <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
        </RadioGroup>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: Switch renders a hidden native <input> nested inside its <span>. */}
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Switch name="darkMode" />
          Dark mode
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </form>
      {submitted && <p>Submitted: {submitted}</p>}
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
    </main>
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
