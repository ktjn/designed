import { RelativeTime, Stack } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const FIXED_NOW = new Date("2026-06-15T12:00:00.000Z");

const meta: Meta<typeof RelativeTime> = {
  title: "RelativeTime",
  component: RelativeTime,
};

export default meta;
type Story = StoryObj<typeof RelativeTime>;

export const Default: Story = {
  args: {
    date: "2026-06-15T11:45:00.000Z",
    now: FIXED_NOW,
    locale: "en-US",
  },
};

export const Formats: Story = {
  render: () => (
    <Stack gap="sm" align="start">
      <div>
        Long:{" "}
        <RelativeTime
          date="2026-06-15T11:55:00.000Z"
          now={FIXED_NOW}
          locale="en-US"
          format="long"
        />
      </div>
      <div>
        Short:{" "}
        <RelativeTime
          date="2026-06-15T11:55:00.000Z"
          now={FIXED_NOW}
          locale="en-US"
          format="short"
        />
      </div>
      <div>
        Narrow:{" "}
        <RelativeTime
          date="2026-06-15T11:55:00.000Z"
          now={FIXED_NOW}
          locale="en-US"
          format="narrow"
        />
      </div>
      <div>
        Numeric auto:{" "}
        <RelativeTime
          date="2026-06-14T12:00:00.000Z"
          now={FIXED_NOW}
          locale="en-US"
          numeric="auto"
        />
      </div>
      <div>
        Numeric always:{" "}
        <RelativeTime
          date="2026-06-14T12:00:00.000Z"
          now={FIXED_NOW}
          locale="en-US"
          numeric="always"
        />
      </div>
      <div>
        Future:{" "}
        <RelativeTime
          date="2026-06-17T12:00:00.000Z"
          now={FIXED_NOW}
          locale="en-US"
        />
      </div>
    </Stack>
  ),
};

export const CustomFormatter: Story = {
  args: {
    date: "2026-06-14T11:00:00.000Z",
    now: FIXED_NOW,
    formatter: (elapsedMilliseconds) => {
      const seconds = Math.max(0, Math.floor(elapsedMilliseconds / 1000));
      if (seconds < 60) return `${seconds}s ago`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      return `${Math.floor(seconds / 3600)}h ago`;
    },
  },
};
