import Pin from "@/lib/models/pin.model"
import User from "@/lib/models/user.model"
import Comment from "@/lib/models/comment.model"
import { PinInfoBasic } from "@/lib/types"
import { revalidatePath } from "next/cache"

const pinResolver = {
  Query: {
    async pins(_: any, { currentNumber, limit }: { currentNumber: number; limit: number }) {
      // Test this out:
      // we don't use field resolver here, because it will send one request for each pin. While we need to fetch dozens of pins
      const pins = await Pin.find({})
        .sort({ createdAt: "desc" })
        .skip(currentNumber)
        .limit(limit)
        .populate({ path: "author", model: User })
      return pins
    },

    async pin(_: any, { pinId }: { pinId: string }) {
      const pin = await Pin.findById(pinId)
        .populate({
          path: "author",
          model: User,
        })
        .populate({
          path: "comments",
          model: Comment,
          populate: [
            { path: "author", model: User },
            { path: "replies", model: Comment },
            { path: "replyToUser", model: User },
          ],
        })
        .populate({
          path: "reactions",
          populate: { path: "user", model: User, select: "firstName imageUrl" },
        })
      return pin
    },
  },
  Mutation: {
    async updatePin(_: any, { pin }: { pin: PinInfoBasic }) {
      const updatedPin = await Pin.findByIdAndUpdate(pin._id, pin, {
        new: true, // new: true -- return the updated document
        select: "title description link",
      })
      revalidatePath(`/pin/${updatedPin._id}`)
      return updatedPin
    },
  },
}

export default pinResolver
