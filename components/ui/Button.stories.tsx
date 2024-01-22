import type { Meta, StoryObj } from "@storybook/react"
import Image from "next/image"
import searchIcon from "../../public/assets/search.svg"

import Button from "./Button"

const meta = {
  title: "Example/Button",
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
  },
}
export const Icon: Story = {
  args: {
    children: <Image src={searchIcon} alt="search" width={24} height={24} />,
  },
}
