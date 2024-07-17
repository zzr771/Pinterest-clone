import Pin from "@/lib/models/pin.model"
import User from "@/lib/models/user.model"
import Comment from "@/lib/models/comment.model"
import { revalidatePath } from "next/cache"

const commentResolver = {
  Mutation: {
    async comment(
      _: any,
      {
        input,
      }: {
        input: {
          pinId: string
          userId: string
          content: string
          isReply: boolean
          replyToUser: string | null
          replyToComment: string | null
        }
      }
    ) {
      const { pinId, userId, content, isReply, replyToUser, replyToComment } = input
      const newComment = await Comment.create({
        author: userId,
        content,
        isReply,
        likes: 0,
        commentOnPin: pinId,
        replies: [],

        replyToUser,
        replyToComment,
      })

      if (!isReply) {
        const target = await Pin.findByIdAndUpdate(pinId, { $push: { comments: newComment._id } })
        if (!target) {
          throw new Error("Pin does not exist")
        }
      } else {
        const target = await Comment.findByIdAndUpdate(replyToComment, { $push: { replies: newComment._id } })
        if (!target) {
          throw new Error("Pin does not exist")
        }
      }

      const author = await User.findById(userId).select("firstName imageUrl")
      newComment.author = author

      revalidatePath(`/pin/${pinId}`)
      return newComment
    },

    async editComment(_: any, args: { pinId: string; commentId: string; content: string }) {
      await Comment.findByIdAndUpdate(args.commentId, { content: args.content })

      revalidatePath(`/pin/${args.pinId}`)

      const comments = await fetchComments(args.pinId)
      return comments
    },

    async deleteComment(
      _: any,
      args: { commentId: string; commentOnPin: string; replyToComment: string | null }
    ) {
      const commentsToDelete = [args.commentId]

      // If this comment is a 'reply'
      if (args.replyToComment) {
        const target = await Comment.findByIdAndUpdate(args.replyToComment, {
          $pull: { replies: args.commentId },
        })
        if (!target) {
          throw new Error("Comment does not exist")
        }
      }
      // If this comment is a 'comment'
      else {
        const target = await Pin.findByIdAndUpdate(args.commentOnPin, { $pull: { comments: args.commentId } })
        if (!target) {
          throw new Error("Pin does not exist")
        }
        const { replies } = await Comment.findById(args.commentId)
        commentsToDelete.push(...replies)
      }

      await Comment.deleteMany({ _id: { $in: commentsToDelete } })
      revalidatePath(`/pin/${args.commentOnPin}`)

      return true
    },
  },
}

async function fetchComments(pinId: string) {
  const pin = await Pin.findById(pinId).populate({
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
  return pin.comments
}

export default commentResolver
