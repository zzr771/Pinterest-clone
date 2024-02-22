import type { Meta, StoryObj } from "@storybook/react"

import SearchBar from "./SearchBar"

const meta = {
  title: "layout/SearchBar",
  component: SearchBar,
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
} satisfies Meta<typeof SearchBar>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
