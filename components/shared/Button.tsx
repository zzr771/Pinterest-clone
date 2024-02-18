interface Props {
  size?: "tiny" | "small" | "normal" | "large"
  bgColor?: "white" | "black" | "red" | "gray" | "transparent" | "translucent"
  shadow?: boolean
  hover?: boolean
  rounded?: boolean
  clickEffect?: boolean // shrink on click
  text?: string // either text or children must be passed in
  children?: React.ReactNode
  className?: string
  click?: (param: any) => void
}

export default function Button({
  size = "normal",
  bgColor = "transparent",
  shadow = false,
  hover = false,
  rounded = false,
  clickEffect = false,
  text,
  children,
  className = "",
  click,
}: Props) {
  let sizeClass = ""
  switch (size) {
    case "tiny":
      sizeClass = "h-6"
      break
    case "normal":
      sizeClass = rounded ? "h-12 text-base" : "px-4 h-12 text-base"
      break
    case "small":
      sizeClass = rounded ? "h-8 text-sm" : "px-3 h-8 text-sm"
      break
    case "large":
      sizeClass = "h-14"
      break
  }

  let bgColorClass = ""
  switch (bgColor) {
    case "white":
      bgColorClass = "bg-white"
      break
    case "black":
      bgColorClass = "bg-black"
      break
    case "red":
      bgColorClass = "bg-red"
      break
    case "translucent":
      bgColorClass = "bg-gray-tp-2"
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
    shadowClass = "shadow-small"
  }

  let hoverClass = ""
  if (hover) {
    switch (bgColor) {
      case "red":
        hoverClass = "hover:bg-red-dark"
        break
      case "white":
      case "transparent":
        hoverClass = "hover:bg-gray-bg-4"
        break
      case "translucent":
        hoverClass = "hover:bg-white"
        break
    }
  }

  let roundedClass = ""
  if (rounded) {
    roundedClass = "aspect-square"
  }

  let clickEffectClass = ""
  if (clickEffect) {
    clickEffectClass = "active:scale-90 transition-all"
  }

  return (
    <button
      type="button"
      onClick={click}
      className={`flex items-center justify-center rounded-full font-medium cursor-pointer
      ${sizeClass} 
      ${textColorClass}
      ${bgColorClass}
      ${shadowClass}
      ${hoverClass}
      ${roundedClass}
      ${clickEffectClass}
      ${className}
      `}>
      {text || children}
    </button>
  )
}
