import User from "@/lib/models/user.model"
import Comment from "@/lib/models/comment.model"
import { getErrorMessage } from "@/lib/utils"
import { revalidatePath } from "next/cache"

const userResolver = {
  Mutation: {
    async savePin(_: any, args: { userId: number; pinId: number }) {
      try {
        // $addToSet: if an item is already in the array, it won't be added again
        await User.findOneAndUpdate({ _id: args.userId }, { $addToSet: { saved: args.pinId } })
        return {
          success: true,
          message: "Pin saved",
        }
      } catch (error) {
        return {
          success: false,
          message: getErrorMessage(error),
        }
      }
    },
    async unsavePin(_: any, args: { userId: number; pinId: number }) {
      try {
        await User.findOneAndUpdate({ _id: args.userId }, { $pull: { saved: args.pinId } })
        return {
          success: true,
          message: "Pin unsaved",
        }
      } catch (error) {
        return {
          success: false,
          message: getErrorMessage(error),
        }
      }
    },

    async followUser(_: any, args: { userId: number; targetUserId: number; path: string }) {
      try {
        await User.findOneAndUpdate({ _id: args.userId }, { $addToSet: { following: args.targetUserId } })
        await User.findOneAndUpdate(
          { _id: args.targetUserId },
          { $addToSet: { follower: args.targetUserId } }
        )
        revalidatePath(args.path)
        return {
          success: true,
          message: "Following",
        }
      } catch (error) {
        return {
          success: false,
          message: getErrorMessage(error),
        }
      }
    },
    async unfollowUser(_: any, args: { userId: number; targetUserId: number; path: string }) {
      try {
        await User.findOneAndUpdate({ _id: args.userId }, { $pull: { following: args.targetUserId } })
        await User.findOneAndUpdate({ _id: args.targetUserId }, { $pull: { follower: args.targetUserId } })
        revalidatePath(args.path)
        return {
          success: true,
          message: "Unfollowed",
        }
      } catch (error) {
        return {
          success: false,
          message: getErrorMessage(error),
        }
      }
    },

    async likeComment(_: any, args: { userId: string; commentId: string; pinId: string }) {
      try {
        const user = await User.findById(args.userId)
        if (user.likedComments.includes(args.commentId)) {
          throw new Error("Already liked")
        }

        await Comment.findByIdAndUpdate(args.commentId, { $inc: { likes: 1 } })

        user.likedComments.push(args.commentId)
        if (user.likedComments.length >= 100) {
          user.likedComments.shift()
        }
        await user.save()

        revalidatePath(`/pins/${args.pinId}`)
        return {
          success: true,
          message: "",
        }
      } catch (error) {
        return {
          success: false,
          message: getErrorMessage(error),
        }
      }
    },

    async unlikeComment(_: any, args: { userId: string; commentId: string; pinId: string }) {
      try {
        const user = await User.findById(args.userId)
        const index = user.likedComments.indexOf(args.commentId)
        if (index === -1) {
          throw new Error("Already unliked")
        }

        await Comment.findByIdAndUpdate(args.commentId, { $inc: { likes: -1 } })

        user.likedComments.splice(index, 1)
        await user.save()

        revalidatePath(`/pins/${args.pinId}`)
        return {
          success: true,
          message: "",
        }
      } catch (error) {
        return {
          success: false,
          message: getErrorMessage(error),
        }
      }
    },
  },
}

export default userResolver
