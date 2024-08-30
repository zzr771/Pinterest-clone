import type { Meta, StoryObj } from "@storybook/react"

import CommentCard from "./CommentCard"

const meta = {
  title: "cards/CommentCard",
  component: CommentCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[450px]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof CommentCard>

export default meta
type Story = StoryObj<typeof meta>
