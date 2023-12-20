import type { Meta, StoryObj } from "@storybook/react";

import { JobProfileForm } from "@/app/customer/requests/create/request-form";
import { noop } from "@/lib/utils";

const meta = {
  title: "Job Profile",
  component: JobProfileForm,
} satisfies Meta<typeof JobProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {
  args: {
    data: undefined,
    onFilled: noop,
  },
};
