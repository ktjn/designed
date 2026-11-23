import { Button, CommandPalette } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof CommandPalette> = {
  title: "CommandPalette",
  component: CommandPalette,
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

const ITEMS = [
  { id: "new-doc", label: "New Document", group: "Create", shortcut: "Ctrl+N" },
  {
    id: "open-settings",
    label: "Open Settings",
    group: "Preferences",
    keywords: ["config", "theme"],
  },
  { id: "toggle-theme", label: "Toggle Dark Mode", group: "Preferences" },
  { id: "archive", label: "Archive Project", group: "Danger", disabled: true },
];

function CommandPaletteDemo({
  initialOpen = false,
}: {
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  return (
    <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
      <Button onClick={() => setOpen(true)}>Open command palette</Button>
      {lastSelected ? (
        <span style={{ fontFamily: "var(--ds-font-family-base)" }}>
          Selected: {lastSelected}
        </span>
      ) : null}
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={ITEMS}
        onSelect={(item) => setLastSelected(item.label)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <CommandPaletteDemo />,
};

export const FilterAndSelectInteraction: Story = {
  render: () => <CommandPaletteDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Open command palette" }),
    );
    const input = await within(document.body).findByRole("combobox", {
      name: "Search commands",
    });
    await userEvent.type(input, "theme");
    await userEvent.keyboard("{Enter}");
    await expect(
      await canvas.findByText("Selected: Open Settings"),
    ).toBeInTheDocument();
  },
};

const SEARCH_RESULTS = [
  { id: "handbook", label: "Team Handbook", kind: "Document", terms: "guide" },
  { id: "design", label: "Design System", kind: "Project", terms: "guide" },
];

function AsyncSearchDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ query: "", items: SEARCH_RESULTS });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const search = query.trim().toLowerCase();
      const items = SEARCH_RESULTS.filter(
        (item) =>
          item.terms.includes(search) ||
          item.label.toLowerCase().includes(search),
      );
      setResults({ query, items });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Search workspace</Button>
      <CommandPalette
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
        query={query}
        onQueryChange={setQuery}
        items={results.items}
        status={
          results.query !== query
            ? { kind: "loading", message: "Searching workspace…" }
            : undefined
        }
        getResultsAnnouncement={(count) =>
          count === 1 ? "1 result" : `${count} results`
        }
        filter={null}
        renderItem={(item) => (
          <span>
            {item.label} · {item.kind}
          </span>
        )}
      />
    </>
  );
}

export const AsyncSearch: Story = {
  render: () => <AsyncSearchDemo />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Search workspace" }),
    );
    const body = within(document.body);
    const input = await body.findByRole("combobox");
    const [pending] = await Promise.all([
      body.findByText("Searching workspace…", {
        selector: '[data-slot="command-palette-status"]',
      }),
      userEvent.type(input, "handbook"),
    ]);
    await expect(pending).toHaveAttribute("data-state", "loading");
    await expect(await body.findByText("1 result")).toBeInTheDocument();
    await expect(
      body.getByRole("option", { name: "Team Handbook · Document" }),
    ).toBeInTheDocument();
    await expect(
      body.queryByRole("option", { name: "Design System · Project" }),
    ).not.toBeInTheDocument();
  },
};
