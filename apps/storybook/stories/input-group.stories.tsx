import { SearchIcon } from "@ktjn/design-icons";
import { Field, InputGroup, Kbd, Stack } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof InputGroup> = {
  title: "InputGroup",
  component: InputGroup,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  render: () => (
    <Stack gap="lg">
      <Field>
        <Field.Label>Search</Field.Label>
        <InputGroup>
          <InputGroup.Addon>
            <SearchIcon aria-hidden />
          </InputGroup.Addon>
          <InputGroup.Input placeholder="Search components..." />
          <InputGroup.Addon align="end">
            <Kbd size="sm">⌘K</Kbd>
          </InputGroup.Addon>
        </InputGroup>
      </Field>
      <Field>
        <Field.Label>Website</Field.Label>
        <InputGroup>
          <InputGroup.Addon>https://</InputGroup.Addon>
          <InputGroup.Input placeholder="example.com" />
          <InputGroup.Addon align="end">.dev</InputGroup.Addon>
        </InputGroup>
      </Field>
    </Stack>
  ),
};
