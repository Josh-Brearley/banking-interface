import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  args: { label: "Email", placeholder: "you@eaglebank.com" },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "We'll never share your email." },
};

export const WithError: Story = {
  args: { error: "Enter a valid email address.", defaultValue: "not-an-email" },
};

export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    showPasswordToggle: true,
    placeholder: "••••••••",
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "locked@eaglebank.com" },
};
