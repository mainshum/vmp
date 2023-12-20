import type { Meta, StoryObj } from "@storybook/react";

import { RequestsTable } from "@/app/customer/requests/request-table";
import { RouterOutputs } from "@/lib/trpc";

const meta = {
  title: "Customer/Requests",
  component: RequestsTable,
} satisfies Meta<typeof RequestsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const data: RouterOutputs["requestsPreviews"] = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: `${i}`,
    name: `Request ${i}`,
    status: "PENDING",
    creationDate: new Date().toLocaleString(),
    validUntil: new Date().toLocaleString(),
    offersCount: i,
  }));

export const Create: Story = {
  args: {
    requests: data,
  },
};
