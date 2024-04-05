"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { getErrorMessage } from "../utils"
import { RequestError } from "../types"

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

export async function createUser({ id, username, imageUrl }: initUserParams): Promise<void | RequestError> {
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
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

interface DuplicateUsername {
  isDuplicate: true
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
}: userParams): Promise<void | RequestError | DuplicateUsername> {
  connectToDB()
  try {
    const existingUser = await User.findOne({ username })
    if (existingUser && existingUser.id !== id) {
      return {
        isDuplicate: true,
      }
    }
    await User.findOneAndUpdate({ id }, { imageUrl, firstName, lastName, about, website, username })

    if (path === "/settings") {
      revalidatePath(path)
    }
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function fetchUserSettings(id: string): Promise<userParams | RequestError> {
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
      return {
        errorMessage: "User doesn't exist",
      }
    }
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

// temp
export async function adjustUserProperties() {
  connectToDB()
  try {
    const res = await User.updateMany({}, { $set: { drafts: [] } })
    console.log(res)
  } catch (err) {}
}
