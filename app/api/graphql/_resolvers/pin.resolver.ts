import Pin from "@/lib/models/pin.model"
import User from "@/lib/models/user.model"
import Comment from "@/lib/models/comment.model"

const pinResolver = {
  Query: {
    async pins(_: any, args: { currentNumber: number; limit: number }) {
      // we don't use field resolver here, because it will send one request for each pin. While we need to fetch dozens of pins
      const pins = await Pin.find({})
        .sort({ createdAt: "desc" })
        .skip(args.currentNumber)
        .limit(args.limit)
        .populate({ path: "author", select: "_id username imageUrl" })
      return pins
    },
  },
}

export default pinResolver
