import type { Meta, StoryObj } from "@storybook/react"

import DropDownList from "./DropDownList"

const meta = {
  title: "shared/DropDownList",
  component: DropDownList,
  parameters: {
    layout: "top",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DropDownList>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    options: [
      {
        label: "option1",
        callback: () => {
          console.log("option1")
        },
      },
      {
        label: "option2",
        callback: () => {
          console.log("option2")
        },
      },
    ],
    title: "Sort by",
  },
}

export const feedBack: Story = {
  args: {
    options: [
      {
        label: "option1",
        callback: () => {
          console.log("option1")
        },
      },
      {
        label: "option2",
        callback: () => {
          console.log("option2")
        },
      },
    ],
    onSelectionChange(selectedOption) {
      console.log("onSelectionChange", selectedOption)
    },
    showCheckMark: true,
    title: "Sort by",
  },
}
