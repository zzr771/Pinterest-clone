import type { Meta, StoryObj } from "@storybook/react"

import PinCard from "./PinCard"
import StoreProvider from "../StoreProvider"

const meta = {
  title: "cards/PinCard",
  component: PinCard,
  parameters: {
    layout: "top",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoreProvider>
        <Story />
      </StoreProvider>
    ),
  ],
} satisfies Meta<typeof PinCard>

export default meta
type Story = StoryObj<typeof meta>
