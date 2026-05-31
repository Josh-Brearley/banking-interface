import type { Meta, StoryObj } from "@storybook/react";
import { FeaturePlaceholder } from "./FeaturePlaceholder";

/** Scaffold shown for a routed-but-unbuilt screen; points at its spec + branch. */
const meta = {
  title: "Molecules/FeaturePlaceholder",
  component: FeaturePlaceholder,
  tags: ["autodocs"],
  args: { spec: "specs/features/cards.spec.md", branch: "feat/cards" },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeaturePlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
