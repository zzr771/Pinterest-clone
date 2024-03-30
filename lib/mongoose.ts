import mongoose from "mongoose"

let isConnected = false

export const connectToDB = async () => {
  mongoose.set("strictQuery", true) // prevent unknown field queries

  // 如果没有数据库URI可供连接
  if (!process.env.MONGODB_URI) return console.log("MONGODB_URI not found")

  if (isConnected) return console.log("already connected to mongodb")
  // 连接到mongo数据库
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("connected to mongodb")
    isConnected = true
  } catch (err) {
    console.log("connect to mongodb error", err)
  }
}
