import type { Meta, StoryObj } from "@storybook/react"
import Button from "./Button"

import ToolTip from "../shared/ToolTip"

const meta = {
  title: "shared/ToolTip",
  component: ToolTip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof ToolTip>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    position: "top",
    text: "More options",
    children: <Button text="Home" bgColor="red" />,
  },
}
