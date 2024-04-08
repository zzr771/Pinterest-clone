"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { getErrorMessage } from "../utils"
import { RequestError, UserSettings } from "../types"

interface initUserParams {
  id: string
  username: string
  imageUrl: string
}

// Match user by id. If not found, create a new user. If found, return the user.
export async function createUserIfNeeded({
  id,
  username,
  imageUrl,
}: initUserParams): Promise<void | UserSettings | RequestError> {
  connectToDB()
  try {
    let user = await User.findOne({ id }, [
      "id",
      "imageUrl",
      "username",
      "firstName",
      "lastName",
      "about",
      "website",
    ])
    if (!user) {
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
    } else {
      user = JSON.parse(JSON.stringify(user))
      return user
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
}: UserSettings): Promise<void | RequestError | DuplicateUsername> {
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

export async function fetchUserSettings(id: string): Promise<UserSettings | RequestError> {
  connectToDB()
  try {
    let user = await User.findOne({ id }, [
      "id",
      "imageUrl",
      "username",
      "firstName",
      "lastName",
      "about",
      "website",
    ])

    if (user) {
      user = JSON.parse(JSON.stringify(user))
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
