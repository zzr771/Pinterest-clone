import type { Meta, StoryObj } from "@storybook/react"

import NavBarBottom from "./NavBarBottom"

const meta = {
  title: "ui/NavBarBottom",
  component: NavBarBottom,
  parameters: {
    layout: "top",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-5 w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavBarBottom>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
