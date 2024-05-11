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
        replyToUser,
        replyToComment,
        likes: 0,
        commentOnPin: pinId,
        replies: [],
      })

      if (!isReply) {
        await Pin.findByIdAndUpdate(pinId, { $push: { comments: newComment._id } })
      } else {
        await Comment.findByIdAndUpdate(replyToComment, { $push: { replies: newComment._id } })
      }

      revalidatePath(`/pin/${pinId}`)

      const comments = await fetchComments(pinId)
      return comments
    },

    async editComment(_: any, args: { pinId: string; commentId: string; content: string }) {
      await Comment.findByIdAndUpdate(args.commentId, { content: args.content })

      revalidatePath(`/pin/${args.pinId}`)

      const comments = await fetchComments(args.pinId)
      return comments
    },

    async deleteComment(
      _: any,
      args: { pinId: string; commentId: string; commentOnPin: string; replyToComment: string | null }
    ) {
      const commentsToDelete = [args.commentId]

      // If this comment is a 'reply'
      if (args.replyToComment) {
        await Comment.findByIdAndUpdate(args.replyToComment, { $pull: { replies: args.commentId } })
      }
      // If this comment is a 'comment'
      else {
        await Pin.findByIdAndUpdate(args.pinId, { $pull: { comments: args.commentId } })
        const { replies } = await Comment.findById(args.commentId)
        commentsToDelete.push(...replies)
      }

      await Comment.deleteMany({ _id: { $in: commentsToDelete } })

      const comments = await fetchComments(args.pinId)
      return comments
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
