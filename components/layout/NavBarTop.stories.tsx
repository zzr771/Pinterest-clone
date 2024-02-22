import type { Meta, StoryObj } from "@storybook/react"

import NavBarTop from "./NavBarTop"

const meta = {
  title: "layout/NavBarTop",
  component: NavBarTop,
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
} satisfies Meta<typeof NavBarTop>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
