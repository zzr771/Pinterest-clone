import type { Meta, StoryObj } from "@storybook/react"
import SearchSuggestionCard from "./SearchSuggestionCard"

const meta = {
  title: "Cards/SearchSuggestionCard",
  component: SearchSuggestionCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof SearchSuggestionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    title: "Office inspiration",
    image: "/assets/test/search-suggestion-card-image.jpg",
    id: "",
  },
}
