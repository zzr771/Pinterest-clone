"use server"

import { connectToDB } from "../mongoose"
import User from "../models/user.model"
import { getErrorMessage } from "../utils"
import { RequestError, UserInfo, UserSetting, PinDraft, UserList } from "../types"
import { duplicateImage } from "./uploadthing.actions"

connectToDB()

interface initUserParams {
  id: string
  username: string
  imageUrl: string
}

// Match user by id. If not found, create a new user. If found, return the user's information.
export async function fetchOrCreateUser({
  id,
  username,
  imageUrl,
}: initUserParams): Promise<UserInfo | RequestError> {
  try {
    // Note the parameter is 'id', not '_id'
    let user = await User.findOne({ id }, [
      "id",
      "imageUrl",
      "username",
      "firstName",
      "lastName",
      "about",
      "website",
      "created",
      "saved",
      "following",
      "follower",
      "likedComments",
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
        created: [],
        saved: [],
        following: [],
        follower: [],
        likedComments: [],
      })
      user = await newUser.save()
    }
    return JSON.parse(JSON.stringify(user))
  } catch (error: any) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function fetchUserInfo(userId: string): Promise<UserInfo | RequestError> {
  try {
    const user = await User.findById(userId, [
      "id",
      "imageUrl",
      "username",
      "firstName",
      "lastName",
      "about",
      "website",
      "created",
      "saved",
      "following",
      "follower",
      "likedComments",
    ])
    if (user) {
      return JSON.parse(JSON.stringify(user))
    } else {
      return {
        errorMessage: "User not found.",
      }
    }
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function fetchUserFollowList(
  userId: string,
  type: "following" | "follower"
): Promise<UserList | RequestError> {
  try {
    let user
    if (type === "following") {
      user = await User.findById(userId).populate({
        path: "following",
        model: User,
        select: "firstName lastName imageUrl",
      })
      return JSON.parse(JSON.stringify(user.following))
    } else {
      user = await User.findById(userId).populate({
        path: "follower",
        model: User,
        select: "firstName lastName imageUrl",
      })
      return JSON.parse(JSON.stringify(user.follower))
    }
  } catch (error) {
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
}: UserSetting): Promise<void | RequestError | DuplicateUsername> {
  try {
    const existingUser = await User.findOne({ username })
    if (existingUser && String(existingUser._id) !== _id) {
      return {
        isDuplicate: true,
      }
    }

    await User.findByIdAndUpdate(_id, { imageUrl, firstName, lastName, about, website, username })
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function fetchUserSettings(userId: string): Promise<UserSetting | RequestError> {
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
        errorMessage: "User doesn't exist.",
      }
    }
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function fetchUserDrafts(userId: string): Promise<PinDraft[] | RequestError> {
  try {
    const user = await User.findById(userId)
    if (!user) {
      return {
        errorMessage: "User doesn't exist.",
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
  try {
    const user = await User.findById(userId)
    if (!user) {
      return {
        errorMessage: "User doesn't exist.",
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
  try {
    const user = await User.findById(userId)
    if (!user) {
      return {
        errorMessage: "User doesn't exist.",
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
  try {
    const user = await User.findById(userId)
    if (!user) {
      return {
        errorMessage: "User doesn't exist.",
      }
    }

    const target = user.drafts.find((item: PinDraft) => item._id === OriginaldraftId)
    if (!target) {
      return {
        errorMessage: "Draft doesn't exist.",
      }
    }

    const duplicatedImage = await duplicateImage(target.imageUrl)
    if (!duplicatedImage) {
      return {
        errorMessage: "Duplication went wrong.",
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
  try {
    const res = await User.updateMany({}, { $set: { drafts: [] } })
  } catch (err) {}
}
