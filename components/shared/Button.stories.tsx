import type { Meta, StoryObj } from "@storybook/react"
import { FaSearch } from "react-icons/fa"

import Button from "../shared/Button"

const meta = {
  title: "shared/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    size: "normal",
    bgColor: "translucent",
    hover: false,
    shadow: false,
    text: "Home",
    click: () => {},
  },
}
export const Icon: Story = {
  args: {
    children: <FaSearch className="text-gray-font-3" />,
  },
}
