import mongoose from "mongoose"

const pinSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    imageSize: {
      type: {
        width: {
          type: Number,
        },
        height: {
          type: Number,
        },
      },
      required: true,
    },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    link: { type: String, trim: true },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reactionId: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
)

const Pin = mongoose.models.Pin || mongoose.model("Pin", pinSchema)
export default Pin
