import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckIcon,
  EditIcon,
  InfoIcon,
} from "@ktjn/designed-icons";
import { RelativeTime, Timeline } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Timeline> = {
  title: "Timeline",
  component: Timeline,
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const FIXED_NOW = new Date("2026-06-15T12:00:00.000Z");

export const Default: Story = {
  render: () => (
    <Timeline aria-label="Release activity">
      <Timeline.Item>
        <Timeline.Badge variant="success" />
        <Timeline.Body
          timestamp={
            <RelativeTime
              date="2026-06-15T11:45:00.000Z"
              now={FIXED_NOW}
              locale="en-US"
            />
          }
        >
          Deployed release v2.4.0 to production.
        </Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge variant="info" />
        <Timeline.Body
          timestamp={
            <RelativeTime
              date="2026-06-15T10:00:00.000Z"
              now={FIXED_NOW}
              locale="en-US"
            />
          }
        >
          Approved pull request #412 after CI verification.
        </Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge />
        <Timeline.Body
          timestamp={
            <RelativeTime
              date="2026-06-14T12:00:00.000Z"
              now={FIXED_NOW}
              locale="en-US"
            />
          }
        >
          Opened release branch and started QA pass.
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  ),
};

export const WithIconsAndVariants: Story = {
  render: () => (
    <Timeline aria-label="Incident timeline">
      <Timeline.Item>
        <Timeline.Badge variant="neutral">
          <EditIcon aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body timestamp="09:00 UTC">
          Configuration change submitted by engineering.
        </Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge variant="info">
          <InfoIcon aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body timestamp="09:12 UTC">
          Canary rollout started across EU regions.
        </Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge variant="warning">
          <AlertTriangleIcon aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body timestamp="09:18 UTC">
          Elevated error rate detected on edge workers.
        </Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge variant="danger">
          <AlertCircleIcon aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body timestamp="09:22 UTC">
          Automatic rollback triggered for EU canary.
        </Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge variant="success">
          <CheckIcon aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body timestamp="09:30 UTC">
          Traffic stabilized and incident resolved.
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  ),
};
