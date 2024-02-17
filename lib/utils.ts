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
