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
