//  This component uses an invisible <div> to simulate the height of the <textarea> element.
import * as React from "react"
import { forwardRef, useEffect, useRef, useLayoutEffect } from "react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string
  minRows: number
  maxRows: number
}

export const VirtualTextarea2 = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, placeholder, minRows, maxRows, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const simulatorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const container = containerRef.current
      const textarea = textareaRef.current
      const simulator = simulatorRef.current
      if (!container || !textarea || !simulator) return

      // prevent the interference of devMode double execution (elements' styles won't be reset after the first execution)
      if (container.getAttribute("data-initialized") === "false") {
        container.setAttribute("data-initialized", "true")
      } else {
        return
      }

      const styles = getComputedStyle(textarea)
      const lineHeight = parseInt(styles.lineHeight)
      simulator.style.minHeight = minRows * lineHeight + "px"
      simulator.style.maxHeight = maxRows * lineHeight + "px"
      simulator.style.width = styles.width
      simulator.style.padding = styles.padding
      container.style.padding = styles.padding
      textarea.style.padding = "0px"
    }, [])

    useLayoutEffect(() => {
      const textarea = textareaRef.current
      const simulator = simulatorRef.current
      if (!textarea || !simulator) return

      simulator.textContent = String(props.value) || ""

      const styles = getComputedStyle(simulator)
      textarea.style.height = styles.height
    }, [props.value])

    return (
      <div ref={containerRef} className={`relative ${className}`} data-initialized={false}>
        <textarea
          className={`w-full ${className} !border-none m-0`}
          ref={textareaRef}
          placeholder={placeholder}
          {...props}
        />
        <div
          ref={simulatorRef}
          className={`absolute z-[-1] invisible overflow-y-auto break-word ${className} !p-0 !border-none`}></div>
      </div>
    )
  }
)
