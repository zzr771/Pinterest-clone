import User from "@/lib/models/user.model"
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
          message: "Failed to save the pin",
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
          message: "Failed to unsave the pin",
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
          message: "Failed to follow the user",
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
          message: "Failed to unfollow the user",
        }
      }
    },
  },
}

export default userResolver
