import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageDisplaySize(imageSize: { width: number; height: number }) {
  const ratio = imageSize.height / imageSize.width
  const containerPadding = 16
  let width, height

  if (window.innerWidth >= 820) {
    width = 236
  } else if (window.innerWidth >= 540 && window.innerWidth < 820) {
    width = Math.round((window.innerWidth - containerPadding) / 3)
  } else {
    width = Math.round((window.innerWidth - containerPadding) / 2)
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

export function getCardNumber(screenWidth: number) {
  switch (true) {
    case screenWidth <= 540:
      return 12
    case screenWidth <= 1024:
      return 15
    case screenWidth <= 1440:
      return 25
    case screenWidth <= 1920:
      return 30
    default:
      return 40
  }
}

export function abbreviateNumber(num: number) {
  if (num === 0) return ""

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
