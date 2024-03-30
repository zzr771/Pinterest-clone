"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface initUserParams {
  id: string
  username: string
  imageUrl: string
}
interface userParams extends initUserParams {
  firstName: string
  lastName?: string
  about?: string
  website?: string
  path?: string
}

export async function createUser({ id, username, imageUrl }: initUserParams): Promise<void> {
  connectToDB()
  try {
    const existingUser = await User.findOne({ id })
    if (!existingUser) {
      const newUser = new User({
        id,
        username,
        imageUrl,
        firstName: username,
        lastName: "",
        about: "",
        website: "",
      })
      await newUser.save()
    }
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message}`)
  }
}

export async function updateUser({
  id,
  username,
  imageUrl,
  firstName,
  lastName = "",
  about = "",
  website = "",
  path = "",
}: userParams): Promise<void> {
  connectToDB()
  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
    }
    await User.findOneAndUpdate({ id }, { imageUrl, firstName, lastName, about, website, username })

    if (path === "/settings") {
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`)
  }
}

export async function fetchUserSettings(id: string): Promise<userParams> {
  connectToDB()
  try {
    let user = await User.findOne({ id }, [
      "imageUrl",
      "username",
      "firstName",
      "lastName",
      "about",
      "website",
    ])

    if (user) {
      user = JSON.parse(JSON.stringify(user))
      delete user._id // Prevent interfering the value change check in function 'checkValuesChange'
      return user
    } else {
      throw new Error(`user is null`)
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}
