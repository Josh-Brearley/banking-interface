import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "./icons";

/**
 * Inline SVG icon set — `currentColor`, decorative (`aria-hidden`) by default,
 * no icon dependency. Colour and size are controlled by the parent's text
 * classes.
 */
const meta = {
  title: "Atoms/Icons",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ENTRIES = Object.entries(Icons).filter(([name]) =>
  name.startsWith("Icon"),
) as unknown as [string, (props: { className?: string }) => JSX.Element][];

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 text-primary sm:grid-cols-3 md:grid-cols-4">
      {ENTRIES.map(([name, Icon]) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4"
        >
          <Icon className="h-6 w-6" />
          <code className="text-caption text-foreground-muted">{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-foreground">
      <Icons.IconTransfer className="h-4 w-4" />
      <Icons.IconTransfer className="h-6 w-6" />
      <Icons.IconTransfer className="h-8 w-8" />
      <Icons.IconTransfer className="h-10 w-10 text-secondary" />
    </div>
  ),
};
