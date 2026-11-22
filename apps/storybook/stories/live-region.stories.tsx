import { Button, LiveRegion } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof LiveRegion> = {
  title: "LiveRegion",
  component: LiveRegion,
  parameters: {
    docs: {
      description: {
        component: "Mount the live region before updating its message.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LiveRegion>;

function SearchResults() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Button onClick={() => setCount(count + 1)}>Add result</Button>
      <p>{count} results found</p>
      <LiveRegion>{count > 0 ? `${count} results found` : null}</LiveRegion>
    </>
  );
}

export const SearchUpdate: Story = {
  render: () => <SearchResults />,
};
