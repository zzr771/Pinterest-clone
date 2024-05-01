import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pin: { type: mongoose.Schema.Types.ObjectId, ref: "Pin", required: true },
  content: { type: String, required: true },
  createdAt: { type: Number, required: true },
  likes: { type: Number, required: true },

  replyToComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  replyToUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
})

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)
export default Comment
