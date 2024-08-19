/*
    Native <textarea /> doesn't support maxRows and minRows features. This component
  uses a div with property "contentEditable" to simulate a textarea.
    This solution is more performant than using a <div> to simulate the textarea's
  height. When input changes, the textContent of the div will be updated, which triggers
  reflow. Then we need to get the height of the div, and this will trigger reflow again.
  With current solution, we only need to trigger reflow once.
 */
import * as React from "react"
import { ChangeEvent, forwardRef, useEffect, useRef, useState, useLayoutEffect } from "react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string
  focusOnMount?: boolean
  minRows: number
  maxRows: number
}

export const VirtualTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, placeholder, focusOnMount, minRows, maxRows, ...props }, ref) => {
    const [input, setInput] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)
    const virtualTextAreaRef = useRef<HTMLDivElement>(null)
    const placeHolderRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
      const container = containerRef.current
      const virtualTextArea = virtualTextAreaRef.current
      if (!container || !virtualTextArea) return

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
        3. When a user is typing and 'virtualTextArea.textContent' is set by JS code, the cursor will move to
        the beginning immediately.

        To respond to form.reset() and form.setValue(), we must listen to 'props.value' change. But we can't
      set 'virtualTextArea.textContent' when the user is typing.
        So we check if the virtualTextArea is currently being focused. If it is, we don't update the 
      'virtualTextArea.textContent', so the cursor won't move. If it is not, we can safely assign the new value
      to 'virtualTextArea.textContent'.
    */
    useEffect(() => {
      const virtualTextArea = virtualTextAreaRef.current
      if (document.activeElement !== virtualTextArea) {
        if (virtualTextArea && typeof props.value === "string") {
          virtualTextArea.textContent = props.value
          setInput(props.value)
        }
      }
    }, [props.value])

    useEffect(() => {
      const virtualTextArea = virtualTextAreaRef.current
      if (!virtualTextArea || !virtualTextArea.childNodes[0]) return

      setTimeout(() => {
        // when editing a comment, move the cursor to the end of the text automatically.
        if (focusOnMount && typeof props.value === "string") {
          virtualTextArea.focus()
          const range = document.createRange()
          const selection = window.getSelection()

          // clear current selection
          selection?.removeAllRanges()
          // set the range to the end of the text
          range.setStart(virtualTextArea.childNodes[0], props.value.length)
          range.collapse(true)

          selection?.addRange(range)
        }
      })
    }, [])

    return (
      /* 
          For some reason, sometimes the virtualTextAreaRef fails to prop up the containerRef's
        height. So, turn on containerRef's BFC mode by "overflow-hidden"
      */
      <div ref={containerRef} className={`relative z-[1] overflow-hidden ${className}`}>
        <div ref={placeHolderRef} className="absolute z-[-1] text-[#9CA3AF]">
          {input.length === 0 && placeholder}
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
