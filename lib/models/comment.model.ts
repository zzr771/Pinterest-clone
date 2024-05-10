import mongoose from "mongoose"

/*
    A comment is a 'comment' if it directly comments on a Pin.
    A comment is a 'reply' if it replies to a 'comment' or a 'reply'.
*/
const commentSchema = new mongoose.Schema(
  {
    // common fields
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    likes: { type: Number, required: true },
    isReply: { type: Boolean, required: true },

    // This field is null in a 'reply'
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    // This field is null in a 'reply'
    // When this 'comment' is deleted, use this field to modify the Pin's 'comments' array
    commentOnPin: { type: mongoose.Schema.Types.ObjectId, ref: "Pin" },

    // This field is null in a 'comment'
    // When this 'reply' is deleted, use this field to modify the "comment"'s 'replies' array
    replyToComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    replyToUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)
export default Comment
