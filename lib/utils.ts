import { type ClassValue, clsx } from "clsx"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageDisplaySize(imageSize: { width: number; height: number }) {
  const ratio = imageSize.height / imageSize.width
  const containerPadding = 16
  const pinCardPadding = 8
  let width, height

  if (window.innerWidth >= 820) {
    width = 236
  } else if (window.innerWidth >= 540 && window.innerWidth < 820) {
    width = Math.round((window.innerWidth - containerPadding) / 3) - pinCardPadding
  } else {
    width = Math.round((window.innerWidth - containerPadding) / 2) - pinCardPadding
  }
  height = Math.round(width * ratio)

  return { width, height }
}

export function getRandomColorHex() {
  // Generate RGB values of a random dark color
  const r = Math.floor(Math.random() * 64) + 70
  const g = Math.floor(Math.random() * 64) + 70
  const b = Math.floor(Math.random() * 64) + 70

  // Convert original RGB values to hexadecimal
  const hexR = r.toString(16).padStart(2, "0")
  const hexG = g.toString(16).padStart(2, "0")
  const hexB = b.toString(16).padStart(2, "0")
  return `#${hexR}${hexG}${hexB}`
}

export function getCardNumberLimit(screenSize: number) {
  switch (true) {
    case screenSize <= 540:
      return 12
    case screenSize <= 1024:
      return 15
    case screenSize <= 1440:
      return 25
    case screenSize <= 1920:
      return 30
    default:
      return 40
  }
}

export function abbreviateNumber(num: number) {
  if (num === 0) return "0"

  if (num < 1000) {
    return String(num)
  } else if (num >= 1000 && num < 1000000) {
    const whole = Math.round(num / 100)
    return String(whole / 10) + "k"
  } else {
    const whole = Math.round(num / 100000)
    return String(whole / 10) + "m"
  }
}

export function separateNumberByComma(number: number) {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

export function getErrorMessage(error: unknown): string {
  let message = "Something went wrong"

  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message)
  } else if (typeof error === "string") {
    message = error
  }

  return message
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
  return base64Regex.test(imageData)
}

// check whether a string is in a url format
export function isValidUrl(str: string | undefined | null) {
  if (!str) return false

  const regexp = /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^/\s]*)*$/
  return regexp.test(str)
}

// remove 'http(s)' and 'www' from a url
export function shortenURL(url: string) {
  const regexp1 = /^(https?:\/\/)?(www\.)?/i
  const regexp2 = /\/$/i
  return url.replace(regexp1, "").replace(regexp2, "")
}

export async function handleDownloadImage(imageUrl: string, title: string) {
  const response = await fetch(imageUrl)
  const blobImage = await response.blob()
  const href = URL.createObjectURL(blobImage)

  const anchorElement = document.createElement("a")
  const extension = imageUrl.split(".").pop()
  anchorElement.href = href
  anchorElement.download = `${title}.${extension}`
  document.body.appendChild(anchorElement)
  anchorElement.click()
  document.body.removeChild(anchorElement)
}

interface ApolloError {
  message: string
}
export function handleApolloRequestError(error: ApolloError | ApolloError[]) {
  if (Array.isArray(error)) {
    error.forEach((e) => {
      toast.error(e.message)
    })
  } else {
    toast.error(error.message)
  }
}
