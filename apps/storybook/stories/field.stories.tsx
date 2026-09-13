import { Field, Input } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Field> = {
  title: "Field",
  component: Field,
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <Field>
      <Field.Label>Email</Field.Label>
      <Input name="email" />
      <Field.Description>Used for account notifications.</Field.Description>
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field invalid>
      <Field.Label>Email</Field.Label>
      <Input name="email" />
      <Field.Description>Used for account notifications.</Field.Description>
      <Field.Error>Enter a valid email address.</Field.Error>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field disabled>
      <Field.Label>Email</Field.Label>
      <Input name="email" disabled />
    </Field>
  ),
};
