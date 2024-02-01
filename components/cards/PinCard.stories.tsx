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

export const Primary: Story = {
  args: {
    pinId: "2",
    image: "/assets/test/PinCard/3.jpg",
    imageSize: {
      width: 236,
      height: 464,
    },
    title: "Witness the most amazing scenaries in Alps",
    author: {
      name: "Dodi's Personalized Trip Schedule",
      avatar: "/assets/test/avatar.jpg",
    },
  },
}
