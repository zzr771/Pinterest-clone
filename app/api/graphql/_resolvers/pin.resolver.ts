import Pin from "@/lib/models/pin.model"
import User from "@/lib/models/user.model"
import Comment from "@/lib/models/comment.model"
import { PinInfoBasic, ReactionInfo } from "@/lib/types"
import { revalidatePath } from "next/cache"

const pinResolver = {
  Query: {
    async pins(_: any, { currentNumber, limit }: { currentNumber: number; limit: number }) {
      // No need to use field resolver here, because it requires to populate every property.
      const pins = await Pin.find({})
        .sort({ createdAt: "desc" })
        .skip(currentNumber)
        .limit(limit)
        .populate({ path: "author", model: User })
      return pins
    },

    async pin(_: any, { pinId }: { pinId: string }) {
      const pin = await Pin.findById(pinId)
        .populate({
          path: "author",
          model: User,
        })
        .populate({
          path: "comments",
          model: Comment,
          populate: [
            { path: "author", model: User },
            {
              path: "replies",
              model: Comment,
              populate: [
                { path: "author", model: User },
                { path: "replyToUser", model: User },
              ],
            },
          ],
        })
        .populate({
          path: "reactions",
          populate: { path: "user", model: User, select: "firstName imageUrl" },
        })
      return pin
    },
  },

  Mutation: {
    async updatePin(_: any, { pin }: { pin: PinInfoBasic }) {
      const updatedPin = await Pin.findByIdAndUpdate(pin._id, pin, {
        new: true, // new: true -- return the updated document
        select: "title description link",
      })
      revalidatePath(`/pin/${updatedPin._id}`)
      return updatedPin
    },

    // If the user has already given a reaction, remove the old one and add the new one.
    async addReaction(
      _: any,
      { pinId, reactionId, userId }: { pinId: string; reactionId: string; userId: string }
    ) {
      try {
        const pin = await Pin.findById(pinId)
        const indexToRemove = pin.reactions.findIndex(
          (reaction: ReactionInfo) => reaction.user.toString() === userId
        )
        if (indexToRemove !== -1) {
          pin.reactions.splice(indexToRemove, 1)
        }
        pin.reactions.unshift({ reactionId: reactionId, user: userId })
        await pin.save()

        revalidatePath(`/pin/${pinId}`)
        return true
      } catch (_) {
        return false
      }
    },

    async removeReaction(_: any, { pinId, userId }: { pinId: string; userId: string }) {
      try {
        await Pin.findByIdAndUpdate(pinId, { $pull: { reactions: { user: userId } } })
        revalidatePath(`/pin/${pinId}`)
        return true
      } catch (_) {
        return false
      }
    },
  },
}

export default pinResolver
