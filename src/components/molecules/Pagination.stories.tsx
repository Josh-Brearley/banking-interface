import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: { page: 1, totalPages: 5, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drives `page` through local state so the bounds (disabled Prev/Next) are demoable. */
function PaginationDemo() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} totalPages={5} onPageChange={setPage} />;
}

export const Interactive: Story = {
  render: () => <PaginationDemo />,
};
