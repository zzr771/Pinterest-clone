export function calculateCardSize(imageSize: { width: number; height: number }) {
  const ratio = imageSize.height / imageSize.width
  const containerPadding = 16
  let width, height

  if (window.innerWidth >= 820) {
    return imageSize
  } else if (window.innerWidth >= 540 && window.innerWidth < 820) {
    width = (window.innerWidth - containerPadding) / 3
  } else {
    width = (window.innerWidth - containerPadding) / 2
  }
  height = width * ratio
  return { width, height }
}
