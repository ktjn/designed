import { Field, Fieldset, Input } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Fieldset> = {
  title: "Fieldset",
  component: Fieldset,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

export const Default: Story = {
  render: () => (
    <Fieldset>
      <Fieldset.Legend>Billing details</Fieldset.Legend>
      <Field>
        <Field.Label>Company</Field.Label>
        <Input placeholder="Acme Inc." />
      </Field>
      <Field>
        <Field.Label>Tax ID</Field.Label>
        <Input placeholder="XX-XXXXXXX" />
      </Field>
    </Fieldset>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Fieldset disabled>
      <Fieldset.Legend>Locked settings</Fieldset.Legend>
      <Field>
        <Field.Label>Workspace slug</Field.Label>
        <Input defaultValue="acme" />
      </Field>
    </Fieldset>
  ),
};
