import { Avatar, AvatarGroup, Badge, Stack } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof AvatarGroup> = {
  title: "AvatarGroup",
  component: AvatarGroup,
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

const members = [
  { alt: "Ada Lovelace", fallback: "AL" },
  { alt: "Grace Hopper", fallback: "GH" },
  { alt: "Alan Turing", fallback: "AT" },
  { alt: "Katherine Johnson", fallback: "KJ" },
  { alt: "Margaret Hamilton", fallback: "MH" },
];

export const Default: Story = {
  render: () => (
    <AvatarGroup max={3}>
      {members.map((member) => (
        <Avatar key={member.alt} alt={member.alt} fallback={member.fallback} />
      ))}
    </AvatarGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack gap="md" align="start">
      <AvatarGroup size="small" max={3}>
        {members.map((member) => (
          <Avatar
            key={member.alt}
            alt={member.alt}
            fallback={member.fallback}
          />
        ))}
      </AvatarGroup>
      <AvatarGroup size="medium" max={3}>
        {members.map((member) => (
          <Avatar
            key={member.alt}
            alt={member.alt}
            fallback={member.fallback}
          />
        ))}
      </AvatarGroup>
      <AvatarGroup size="large" max={3}>
        {members.map((member) => (
          <Avatar
            key={member.alt}
            alt={member.alt}
            fallback={member.fallback}
          />
        ))}
      </AvatarGroup>
    </Stack>
  ),
};

export const CustomOverflow: Story = {
  render: () => (
    <AvatarGroup
      max={2}
      renderOverflow={(count) => <Badge variant="info">+{count} more</Badge>}
    >
      {members.map((member) => (
        <Avatar key={member.alt} alt={member.alt} fallback={member.fallback} />
      ))}
    </AvatarGroup>
  ),
};
