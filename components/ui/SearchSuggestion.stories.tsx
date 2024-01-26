import type { Meta, StoryObj } from "@storybook/react"
import SearchSuggestion from "./SearchSuggestion"

const meta = {
  title: "ui/SearchSuggestion",
  component: SearchSuggestion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof SearchSuggestion>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
