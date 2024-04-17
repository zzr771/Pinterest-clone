import mongoose from "mongoose"

const pinSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imageUrl: { type: String, required: true },
  imageSize: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  title: String,
  description: String,
  link: String,
  createdAt: { type: Number, required: true },

  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reaction: { type: Number, required: true },
    },
  ],
})

// If User model already exists, don't recreate it.
const Pin = mongoose.models.Pin || mongoose.model("Pin", pinSchema)
export default Pin
