import * as React from "react"
import { ChangeEvent, forwardRef, useEffect, useRef, useState, useLayoutEffect } from "react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeHolder?: string
  minRows: number
  maxRows: number
}

/*
    Native <textarea /> doesn't support maxRows and minRows features. This component
  uses a div with property "contentEditable" to simulate a textarea.
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
    }, [])

    function handleChange() {
      const text = virtualTextAreaRef.current?.textContent || ""
      setInput(text)

      // pass the text to the form through the onChange callback. The callback is given by the form
      const event = { target: { value: text } } as ChangeEvent<HTMLTextAreaElement>
      props.onChange?.(event)
    }

    /*
      This useEffect is to handle form.reset() and form.setValue().

      Things to know:
        1. When form.reset() is invoked, the original value will be sent to 'props.value'.
        2. When a user types anything or form.setValue() is invoked, props.value will change as well.
        3. When a user is typing and 'virtualTextAre.textContent' is set by JS code, the cursor will move to
        the beginning immediately.

        To respond to form.reset() and form.setValue(), we must listen to 'props.value' change. But we can't
      set 'virtualTextAre.textContent' when the user is typing.
        So we check if the virtualTextAre is currently being focused. If it is, we don't update the 
        'virtualTextAre.textContent', so the cursor won't move. If it is not, we can update the 
        'virtualTextAre.textContent' safely to the new value.
    */
    useEffect(() => {
      const virtualTextAre = virtualTextAreaRef.current
      if (document.activeElement !== virtualTextAre) {
        if (virtualTextAre && typeof props.value === "string") {
          virtualTextAre.textContent = props.value
          setInput(props.value)
        }
      }
    }, [props.value])

    return (
      /* 
          For some reason, sometimes the virtualTextAreaRef fails to prop up the containerRef's
        height. So, turn on containerRef's BFC mode by "overflow-hidden"
      */
      <div ref={containerRef} className={`relative z-[1] overflow-hidden ${className}`}>
        <div ref={placeHolderRef} className="absolute z-[-1] text-[#9CA3AF]">
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
