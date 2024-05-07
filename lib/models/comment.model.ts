import mongoose from "mongoose"

/*
    A comment is a 'comment' if it directly comments on a Pin, and a comment is a 'reply' if 
  it replies to a 'comment' or a 'reply'
*/
const commentSchema = new mongoose.Schema({
  // common fields
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Number, required: true },
  likes: { type: Number, required: true },

  // Only in a 'comment'
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  // When this 'comment' is deleted, use this field to modify the Pin's 'comments' array
  commentOnPin: { type: mongoose.Schema.Types.ObjectId, ref: "Pin" },

  // Only in a 'reply'
  replyToUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // When this 'reply' is deleted, use this field to modify the "comment"'s 'replies' array
  replyToComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
})

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)
export default Comment
