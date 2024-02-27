import type { Meta, StoryObj } from "@storybook/react"

import Reaction from "./Reaction"

const meta = {
  title: "shared/Reaction",
  component: Reaction,
  parameters: {
    // layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[1000px] h-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Reaction>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
