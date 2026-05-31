import type { Meta, StoryObj } from "@storybook/react";
import { CardGraphic } from "./CardGraphic";
import { Card } from "@/components/atoms";

/**
 * Decorative corner contour lines (aria-hidden, pointer-events-none). The
 * parent must be `relative overflow-hidden` and real content `relative` so it
 * paints above the graphic.
 */
const meta = {
  title: "Molecules/CardGraphic",
  component: CardGraphic,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["brand", "secondary", "success", "danger"],
    },
  },
} satisfies Meta<typeof CardGraphic>;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES = ["brand", "secondary", "success", "danger"] as const;

export const InCard: Story = {
  args: { tone: "secondary" },
  render: (args) => (
    <Card className="relative h-40 w-72 overflow-hidden p-5">
      <CardGraphic {...args} />
      <p className="relative text-h3">Card content</p>
      <p className="relative text-body-sm text-foreground-muted">
        Paints above the decorative lines.
      </p>
    </Card>
  ),
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {TONES.map((tone) => (
        <Card key={tone} className="relative h-32 w-56 overflow-hidden p-4">
          <CardGraphic tone={tone} />
          <code className="relative text-caption text-foreground-muted">
            {tone}
          </code>
        </Card>
      ))}
    </div>
  ),
};
