import Pin from "@/lib/models/pin.model"
import User from "@/lib/models/user.model"
import Comment from "@/lib/models/comment.model"
import { PinCardInfo, PinInfoBasic, ReactionInfo } from "@/lib/types"
import { revalidatePath } from "next/cache"

interface CommentInfoShallow {
  _id: string
  author: string
  content: string
  createdAt: string
  likes: number
  isReply: boolean

  replies: string[]
  commentOnPin: string | null

  replyToUser: string | null
  replyToComment: string | null
}

const pinResolver = {
  Query: {
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
          populate: { path: "user", model: User, select: "firstName lastName imageUrl" },
        })

      if (!pin) throw new Error("Sorry, this Pin has been deleted") // This error can trigger 'error.tsx' to take over the page.
      return pin
    },

    async pins(_: any, { currentNumber, limit }: { currentNumber: number; limit: number }) {
      // No need to use field resolver here, because it requires to populate every property.
      const pins = await Pin.find({})
        .sort({ createdAt: "desc" })
        .skip(currentNumber)
        .limit(limit)
        .populate({ path: "author", model: User, select: "firstName lastName imageUrl" })
      return pins
    },

    async userCreatedPins(
      _: any,
      { userId, currentNumber, limit }: { userId: string; currentNumber: number; limit: number }
    ) {
      const user = await User.findById(userId).populate({
        path: "created",
        model: Pin,
        options: {
          skip: currentNumber,
          limit: limit,
        },
        populate: { path: "author", model: User, select: "firstName lastName imageUrl" },
      })
      return user.created
    },

    async userSavedPins(
      _: any,
      { userId, currentNumber, limit }: { userId: string; currentNumber: number; limit: number }
    ) {
      const user = await User.findById(userId)
      const savedIds = user.saved.slice(currentNumber, currentNumber + limit)

      const userDeep = await User.findById(userId).populate({
        path: "saved",
        model: Pin,
        options: {
          skip: currentNumber,
          limit: limit,
        },
        populate: { path: "author", model: User, select: "firstName lastName imageUrl" },
      })

      // If some pins have been deleted
      if (savedIds.length !== userDeep.saved.length) {
        const validIds = userDeep.saved.map((pin: PinCardInfo) => {
          return pin._id
        })
        user.saved.splice(currentNumber, limit, ...validIds)
        await user.save()
      }
      return userDeep.saved
    },

    async searchPins(
      _: any,
      { keyword, currentNumber, limit }: { keyword: string; currentNumber: number; limit: number }
    ) {
      const pins = await Pin.find({
        title: { $regex: keyword, $options: "i" },
      })
        .sort({ createdAt: "desc" })
        .skip(currentNumber)
        .limit(limit)
        .populate({ path: "author", model: User, select: "firstName lastName imageUrl" })
      return pins
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

    async deletePin(_: any, { pinId, userId }: { pinId: string; userId: string }) {
      const pin = await Pin.findById(pinId).populate({ path: "comments", model: Comment })
      const commentsToDelete: string[] = []

      // Delete all comments and replies of the pin.
      pin.comments.forEach((comment: CommentInfoShallow) => {
        commentsToDelete.push(comment._id)
        commentsToDelete.push(...comment.replies)
      })

      try {
        const p1 = new Promise(async (resolve) => {
          await Pin.deleteOne({ _id: pinId })
          resolve(true)
        })
        const p2 = new Promise(async (resolve) => {
          await Comment.deleteMany({ _id: { $in: commentsToDelete } })
          resolve(true)
        })
        const p3 = new Promise(async (resolve) => {
          await User.findByIdAndUpdate(userId, { $pull: { created: pinId } })
          resolve(true)
        })
        await Promise.all([p1, p2, p3])
        revalidatePath(`/pin/${pinId}`)
        return true
      } catch (_) {
        return false
      }
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
