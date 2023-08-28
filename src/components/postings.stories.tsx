import type { Meta, StoryObj } from "@storybook/react";

import Postings from "./postings";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Client/Postings",
  component: Postings,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Postings>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const FakePostings10: Story = {
  args: {
    postings: Array(10).fill(null).map((_, ind) => ({
        name: `Postingidjsfksdjfkljsdkfjsdkljfkl ${ind}`,
        number: `${ind}`,
        offers: Math.floor(Math.random() * 10),
        status: 'new'
    }))
  },
};
