interface Props {
  size?: "tiny" | "small" | "normal" | "large"
  bgColor?: "black" | "red" | "gray" | "transparent" | "translucent"
  shadow?: boolean
  hover?: boolean
  rounded?: boolean
  text?: string // either text or children must be passed in
  children?: React.ReactNode
  click: (param: any) => void
}

export default function Button({
  size = "normal",
  bgColor = "transparent",
  shadow = false,
  hover = false,
  rounded = false,
  text,
  children,
  click,
}: Props) {
  let sizeClass = ""
  switch (size) {
    case "tiny":
      sizeClass = "h-6"
      break
    case "normal":
      sizeClass = "px-4 h-12 text-base"
      break
    case "small":
      sizeClass = "px-3 h-8 text-sm"
      break
    case "large":
      sizeClass = "h-14"
      break
  }

  let bgColorClass = ""
  switch (bgColor) {
    case "black":
      bgColorClass = "bg-black"
      break
    case "red":
      bgColorClass = "bg-red"
      break
    case "translucent":
      bgColorClass = "bg-gray-bg-0"
      break
    case "gray":
      bgColorClass = "bg-gray-bg-4"
      break
  }

  let textColorClass = "text-black"
  if (["black", "red"].includes(bgColor)) {
    textColorClass = "text-white"
  }

  let shadowClass = ""
  if (shadow) {
    shadowClass = "shadow-md"
  }

  let hoverClass = ""
  if (hover) {
    hoverClass = "hover:bg-gray-bg-4"
  }

  let roundedClass = ""
  if (rounded) {
    roundedClass = "aspect-square"
  }

  return (
    <button
      type="button"
      onClick={click}
      className={`flex items-center justify-center rounded-full font-semibold cursor-pointer
      ${sizeClass} 
      ${textColorClass}
      ${bgColorClass}
      ${shadowClass}
      ${hoverClass}
      ${roundedClass}`}>
      {text || children}
    </button>
  )
}
