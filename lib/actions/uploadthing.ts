"use server"
import { UTApi } from "uploadthing/server"
import { RequestError } from "../types"
import { getErrorMessage } from "../utils"

const utapi = new UTApi()
export async function deleteFile(url: string): Promise<void | RequestError> {
  const key = url.split("/").pop()
  if (!key) {
    return {
      errorMessage: "Invalid Image URL",
    }
  }

  try {
    const deleteResult = await utapi.deleteFiles(key)
    if (!deleteResult.success) {
      return {
        errorMessage: "Failed to delete file",
      }
    }
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}
