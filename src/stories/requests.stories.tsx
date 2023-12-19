import type { Meta, StoryObj } from "@storybook/react";

import {
  RequestsTable,
  type RequestTableRow,
} from "@/app/customer/requests/request-table";

const meta = {
  title: "Customer/Requests",
  component: RequestsTable,
} satisfies Meta<typeof RequestsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const data: RequestTableRow[] = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: `${i}`,
    name: `Request ${i}`,
    status: "PENDING",
    creationDate: new Date(),
    validUntil: new Date(),
  }));

export const Create: Story = {
  args: {
    requests: data,
  },
};
