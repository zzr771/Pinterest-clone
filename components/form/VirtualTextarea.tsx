import * as React from "react"
import { ChangeEvent, forwardRef, useEffect, useRef, useState, useLayoutEffect } from "react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeHolder?: string
  minRows: number
  maxRows: number
}

/*
    Native <textarea /> doesn't support maxRows and minRows functions. This component
  uses a div with "contentEditable" to simulate a textarea.
    Compared with simulating the height with an extra textarea, this solution doesn't
  need to consider the influence of the scroll bar. When a scroll bar appears, it
  will take some space, which will definitely affect the height simulation.
 */
export const VirtualTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, placeHolder, minRows, maxRows, ...props }, ref) => {
    const [input, setInput] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)
    const virtualTextAreaRef = useRef<HTMLDivElement>(null)
    const placeHolderRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
      const container = containerRef.current
      const virtualTextArea = virtualTextAreaRef.current
      const placeHolder = placeHolderRef.current
      if (!container || !virtualTextArea || !placeHolder) return

      const styles = getComputedStyle(container)
      const lineHeight = parseInt(styles.lineHeight)
      virtualTextArea.style.minHeight = minRows * lineHeight + "px"
      virtualTextArea.style.maxHeight = maxRows * lineHeight + "px"

      // transfer the container's padding to the textarea's margin
      const padding = styles.padding
      if (parseInt(padding) === 0) return // prevent the influence cuased by the devMode double execution
      virtualTextArea.style.margin = padding
      placeHolder.style.margin = padding
      container.style.padding = "0px"
    }, [])

    function handleChange() {
      const text = virtualTextAreaRef.current?.textContent || ""
      setInput(text)

      // pass the text to the form through the onChange callback. The callback is given by the form
      const event = { target: { value: text } } as ChangeEvent<HTMLTextAreaElement>
      props.onChange?.(event)
    }

    // when invoke form.reset(), manually clear the input (the props.value will become empty string)
    useEffect(() => {
      if (!props.value) {
        setInput("")
        const virtualTextAre = virtualTextAreaRef.current
        if (virtualTextAre) {
          virtualTextAre.textContent = ""
        }
      }
    }, [props.value])

    return (
      /* 
          For some reason, sometimes the virtualTextAreaRef fails to prop up the containerRef's
        height. So, turn on containerRef's BFC through "overflow-hidden"
      */
      <div ref={containerRef} className={`virtualTextarea relative z-[1] overflow-hidden ${className}`}>
        <div ref={placeHolderRef} className="placeholder absolute z-[-1] text-[#9CA3AF]">
          {input.length > 0 ? "" : placeHolder}
        </div>
        <div
          ref={virtualTextAreaRef}
          onInput={handleChange}
          contentEditable
          className="break-word overflow-y-auto focus:outline-none"></div>

        <textarea className="hidden" value={input} ref={ref} {...props} />
      </div>
    )
  }
)
VirtualTextarea.displayName = "Textarea"
