import type { Meta, StoryObj } from "@storybook/react";
import { UpgradeCard } from "./UpgradeCard";

/**
 * Promotional "switch to business" rail card on the brand gradient. The CTA
 * opens a coming-soon modal — a demo upsell that changes no data.
 */
const meta = {
  title: "Dashboard/UpgradeCard",
  component: UpgradeCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UpgradeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
