"use server"
import { UTApi } from "uploadthing/server"
import { RequestError } from "../types"
import { getErrorMessage } from "../utils"

const utapi = new UTApi()
export async function deleteFiles(fileUrls: string[]): Promise<void | RequestError> {
  const keys = fileUrls.map((url) => url.split("/").pop() || "")
  if (keys.length !== fileUrls.length) {
    return {
      errorMessage: "Invalid Image URL.",
    }
  }

  try {
    const deleteResult = await utapi.deleteFiles(keys)
    if (!deleteResult.success) {
      return {
        errorMessage: "Failed to delete file.",
      }
    }
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}

export async function duplicateImage(imageUrl: string) {
  const uploadedFile = await utapi.uploadFilesFromUrl(imageUrl)
  return uploadedFile
}
