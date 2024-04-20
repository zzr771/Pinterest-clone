"use server"

import { revalidatePath } from "next/cache"
import { connectToDB } from "../mongoose"
import User from "../models/user.model"
import { getErrorMessage } from "../utils"
import { RequestError, UserSettings, PinDraft } from "../types"
import { duplicateImage } from "./uploadthing.actions"

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
    // Note the parameter is 'id' instead of '_id"
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
export async function updateUserSetting({
  _id,
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
    if (existingUser && String(existingUser._id) !== _id) {
      return {
        isDuplicate: true,
      }
    }

    await User.findByIdAndUpdate(_id, { imageUrl, firstName, lastName, about, website, username })
    if (path === "/settings") {
      revalidatePath(path)
    }
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function fetchUserSettings(userId: string): Promise<UserSettings | RequestError> {
  connectToDB()
  try {
    let user = await User.findById(userId, [
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

export async function fetchUserDrafts(userId: string): Promise<PinDraft[] | RequestError> {
  connectToDB()
  try {
    const user = await User.findById(userId)
    if (!user) {
      return {
        errorMessage: "User doesn't exist",
      }
    }

    // remove expired drafts
    user.drafts = user.drafts.filter((draft: PinDraft) => draft.expiredAt > Date.now())

    user.save()
    return JSON.parse(JSON.stringify(user.drafts))
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function upsertDraft(userId: string, draft: PinDraft): Promise<PinDraft | RequestError> {
  connectToDB()
  try {
    const user = await User.findById(userId)
    if (!user) {
      return {
        errorMessage: "User doesn't exist",
      }
    }

    const newDraft = { ...draft }
    let index = user.drafts.findIndex((item: PinDraft) => item._id === newDraft._id)

    // If the draft is not found, add it to the drafts array
    if (index === -1) {
      newDraft.expiredAt = Date.now() + 1000 * 3600 * 24 * 30
      user.drafts.unshift(newDraft)
      index = 0
    } else {
      user.drafts[index] = newDraft
    }

    const res = await user.save()
    return JSON.parse(JSON.stringify(res.drafts[index]))
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function deleteDrafts(userId: string, draftId: string[]): Promise<void | RequestError> {
  connectToDB()
  try {
    const user = await User.findById(userId)
    if (!user) {
      return {
        errorMessage: "User doesn't exist",
      }
    }

    user.drafts = user.drafts.filter((item: PinDraft) => !draftId.includes(item._id))
    await user.save()
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function duplicateDraft(
  userId: string,
  OriginaldraftId: string,
  newDraftId: string
): Promise<void | RequestError> {
  connectToDB()
  try {
    const user = await User.findById(userId)
    if (!user) {
      return {
        errorMessage: "User doesn't exist",
      }
    }

    const target = user.drafts.find((item: PinDraft) => item._id === OriginaldraftId)
    if (!target) {
      return {
        errorMessage: "Draft doesn't exist",
      }
    }

    const duplicatedImage = await duplicateImage(target.imageUrl)
    if (!duplicatedImage) {
      return {
        errorMessage: "Duplication went wrong",
      }
    }

    user.drafts.unshift({
      ...JSON.parse(JSON.stringify(target)),
      _id: newDraftId,
      imageUrl: duplicatedImage?.data?.url,
      expiredAt: Date.now() + 1000 * 3600 * 24 * 30,
    })
    await user.save()
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

// For adjusting documents
export async function adjustUserProperties() {
  connectToDB()
  try {
    const res = await User.updateMany({}, { $set: { drafts: [] } })
  } catch (err) {}
}
