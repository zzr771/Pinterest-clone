import User from "@/lib/models/user.model"
import Comment from "@/lib/models/comment.model"
import { revalidatePath } from "next/cache"

const userResolver = {
  Mutation: {
    async savePin(_: any, args: { userId: number; pinId: number }) {
      // $addToSet: if an item is already in the array, it won't be added again
      const user = await User.findByIdAndUpdate(
        args.userId,
        { $addToSet: { saved: args.pinId } },
        { new: true }
      )
      return user.saved
    },
    async unsavePin(_: any, args: { userId: number; pinId: number }) {
      const user = await User.findByIdAndUpdate(args.userId, { $pull: { saved: args.pinId } }, { new: true })
      return user.saved
    },

    async followUser(_: any, args: { userId: number; targetUserId: number; path: string }) {
      const user = await User.findByIdAndUpdate(
        args.userId,
        { $addToSet: { following: args.targetUserId } },
        { new: true }
      )
      await User.findByIdAndUpdate(args.targetUserId, { $addToSet: { follower: args.targetUserId } })

      revalidatePath(args.path)
      return user.following
    },
    async unfollowUser(_: any, args: { userId: number; targetUserId: number; path: string }) {
      const user = await User.findByIdAndUpdate(
        args.userId,
        { $pull: { following: args.targetUserId } },
        { new: true }
      )
      await User.findByIdAndUpdate(args.targetUserId, { $pull: { follower: args.targetUserId } })

      revalidatePath(args.path)
      return user.following
    },

    async likeComment(_: any, args: { userId: string; commentId: string; path: string }) {
      let user = await User.findById(args.userId)
      if (user.likedComments.includes(args.commentId)) {
        throw new Error("Already liked")
      }

      await Comment.findByIdAndUpdate(args.commentId, { $inc: { likes: 1 } })

      user.likedComments.push(args.commentId)
      if (user.likedComments.length >= 100) {
        user.likedComments.shift()
      }
      user = await user.save()

      revalidatePath(args.path)
      return user.likedComments
    },

    async unlikeComment(_: any, args: { userId: string; commentId: string; path: string }) {
      let user = await User.findById(args.userId)
      const index = user.likedComments.indexOf(args.commentId)
      if (index === -1) {
        throw new Error("Already unliked")
      }

      await Comment.findByIdAndUpdate(args.commentId, { $inc: { likes: -1 } })

      user.likedComments.splice(index, 1)
      user = await user.save()

      revalidatePath(args.path)
      return user.likedComments
    },
  },
}

export default userResolver
