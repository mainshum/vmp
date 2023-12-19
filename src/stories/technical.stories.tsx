import type { Meta, StoryObj } from "@storybook/react";

import { TechnicalForm } from "@/app/customer/requests/create/request-form";
import { Software } from "@/app/customer/requests/create/tech";

const meta = {
  title: "Technical",
  component: TechnicalForm,
} satisfies Meta<typeof TechnicalForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    requestId: "1234",
    technical: {},
    techTree: Software.backend,
  },
};
